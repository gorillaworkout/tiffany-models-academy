import { Calendar, BookOpen, User, Star } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <User className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Profile Status</p>
              <p className="text-lg font-semibold text-gray-900">Active</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed Modules</p>
              <p className="text-lg font-semibold text-gray-900">3 / 16</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Next Class</p>
              <p className="text-lg font-semibold text-gray-900">Tomorrow</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Star className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Performance</p>
              <p className="text-lg font-semibold text-gray-900">Excellent</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a 
              href="/modul" 
              className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">Modul Modelling</h5>
              <p className="font-normal text-gray-700">Akses 16 part modul pembelajaran modelling dari dasar hingga lanjutan.</p>
            </a>
            <a 
              href="/jadwal" 
              className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">Jadwal Latihan</h5>
              <p className="font-normal text-gray-700">Lihat jadwal latihan mingguan dan absensi kelas modelling Anda.</p>
            </a>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded bg-primary/10 flex flex-col items-center justify-center text-primary">
                <span className="text-xs font-bold">OCT</span>
                <span className="text-sm font-bold">15</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Basic Catwalk Class</p>
                <p className="text-sm text-gray-500">14:00 - 16:00 | Studio A</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded bg-primary/10 flex flex-col items-center justify-center text-primary">
                <span className="text-xs font-bold">OCT</span>
                <span className="text-sm font-bold">18</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Photo Pose Workshop</p>
                <p className="text-sm text-gray-500">10:00 - 13:00 | Studio C</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded bg-primary/10 flex flex-col items-center justify-center text-primary">
                <span className="text-xs font-bold">OCT</span>
                <span className="text-sm font-bold">22</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Makeup for Runway</p>
                <p className="text-sm text-gray-500">13:00 - 15:00 | Beauty Room</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
