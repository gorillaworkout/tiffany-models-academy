const fs = require('fs');
const path = '/home/ubuntu/apps/tiffany-models-academy/src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Update coordinates to Noble House Jakarta (-6.2280239, 106.825536)
content = content.replace('const studioLat = -6.9164893;', 'const studioLat = -6.2280239;');
content = content.replace('const studioLon = 107.624465;', 'const studioLon = 106.825536;');

// Update UI logic: Only show banner if there's a class today
const oldBannerStart = '{/* LIVE ATTENDANCE GEOFENCING BANNER */}';
const newBannerLogic = `{/* LIVE ATTENDANCE GEOFENCING BANNER - ONLY SHOWS IF THERE IS A CLASS TODAY */}
      <AnimatePresence>
        {!hasCheckedIn && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="mb-8 border p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 bg-zinc-900/60 border-white/10 hover:border-white/30"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 text-white animate-pulse">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-serif mb-1">
                  Live Class Check-in
                </h3>
                <p className="text-xs text-zinc-400">
                  Session 04: Facial Expressions • Today, 14:00
                </p>
              </div>
            </div>
            
            <button 
              onClick={handleCheckIn}
              disabled={isCheckingIn}
              className="w-full md:w-auto px-8 py-4 bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
            >
              {isCheckingIn ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Verifying GPS...</>
              ) : (
                <><Fingerprint className="w-4 h-4" /> Absen Sekarang</>
              )}
            </button>
          </motion.div>
        )}

        {hasCheckedIn && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 border p-6 flex items-center gap-5 bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-serif mb-1 text-white">Attendance Verified</h3>
              <p className="text-xs text-emerald-500/70">
                You have successfully checked in for today's session at Noble House. Have a great training!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>`;

// Just a quick regex replace
const contentParts = content.split('{/* LIVE ATTENDANCE GEOFENCING BANNER */}');
if (contentParts.length > 1) {
  const secondPart = contentParts[1].split('</motion.div>')[1]; // Skip past the old banner
  content = contentParts[0] + newBannerLogic + secondPart;
}

content = content.replace('import { motion } from "framer-motion";', 'import { motion, AnimatePresence } from "framer-motion";');

fs.writeFileSync(path, content);
