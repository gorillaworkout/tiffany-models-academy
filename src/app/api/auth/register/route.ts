export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { d1Query } from '@/lib/d1';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const existing = await d1Query('SELECT id FROM member WHERE email = ?', [data.email]);
    if (existing && existing.length > 0) {
      return NextResponse.json({ success: false, error: "Email sudah terdaftar." }, { status: 400 });
    }

    // Determine role: admin override for specific email, otherwise use submitted role
    const isAdmin = data.email.toLowerCase() === 'darmawanbayu1@gmail.com';
    const validRoles = ['ebook', 'class', 'private'];
    const submittedRole = validRoles.includes(data.role) ? data.role : 'class';
    const role = isAdmin ? 'admin' : submittedRole;
    
    // Admin gets auto-approved, others are pending
    const status = role === 'admin' ? 'approved' : 'pending';

    // Use null for batch_id when not class role
    const batchId = (role === 'class') ? (data.batch || '') : null;
    
    // Only require batch for class role
    if (role === 'class' && !batchId) {
      return NextResponse.json({ success: false, error: "Silakan pilih batch terlebih dahulu." }, { status: 400 });
    }

    // For ebook/private roles, require ebookPackageId
    const ebookPackageId = (role === 'ebook' || role === 'private') ? (data.ebookPackageId || null) : null;
    if ((role === 'ebook' || role === 'private') && !ebookPackageId) {
      return NextResponse.json({ success: false, error: "Please select an e-book package." }, { status: 400 });
    }

    await d1Query(`
      INSERT INTO member (batch_id, nama_lengkap, email, password, no_whatsapp, instagram, tinggi_badan, berat_badan, role, status, alamat, ebook_package_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      batchId, 
      data.fullName || data.name, 
      data.email, 
      data.password, 
      data.whatsapp || "", 
      data.instagram || "", 
      parseInt(data.height) || 0, 
      parseInt(data.weight) || 0, 
      role, 
      status,
      data.address || null,
      ebookPackageId
    ]);

    return NextResponse.json({ success: true, status: status });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
