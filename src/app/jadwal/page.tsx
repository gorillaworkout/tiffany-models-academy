import { Calendar as CalendarIcon, Clock, MapPin, User } from "lucide-react";

const schedule = [
  {
    day: "Senin",
    classes: [
      {
        time: "16:00 - 18:00",
        name: "Basic Posture & Walking",
        instructor: "Coach Sarah",
        studio: "Studio A (Pusat)",
        type: "Beginner",
      }
    ]
  },
  {
    day: "Selasa",
    classes: [
      {
        time: "15:00 - 17:00",
        name: "Photo Posing Basic",
        instructor: "Coach Michael",
        studio: "Studio B (Selatan)",
        type: "All Levels",
      },
      {
        time: "18:00 - 20:00",
        name: "Advanced Runway",
        instructor: "Coach Tiffany",
        studio: "Studio A (Pusat)",
        type: "Advanced",
      }
    ]
  },
  {
    day: "Rabu",
    classes: []
  },
  {
    day: "Kamis",
    classes: [
      {
        time: "16:00 - 18:00",
        name: "Facial Expressions",
        instructor: "Coach Dina",
        studio: "Studio C (Pusat)",
        type: "Intermediate",
      }
    ]
  },
  {
    day: "Jumat",
    classes: [
      {
        time: "15:00 - 17:00",
        name: "Commercial Acting",
        instructor: "Coach Budi",
        studio: "Studio B (Selatan)",
        type: "All Levels",
      }
    ]
  },
  {
    day: "Sabtu",
    classes: [
      {
        time: "10:00 - 12:00",
        name: "Intensive Runway Camp",
        instructor: "Coach Tiffany & Team",
        studio: "Main Hall (Pusat)",
        type: "All Levels",
      },
      {
        time: "13:00 - 15:00",
        name: "Makeup & Styling",
        instructor: "Coach Lisa",
        studio: "Beauty Room (Pusat)",
        type: "Beginner",
      }
    ]
  },
  {
    day: "Minggu",
    classes: [
      {
        time: "10:00 - 14:00",
        name: "Mock Test Shoot",
        instructor: "Guest Photographer",
        studio: "Photo Studio (Pusat)",
        type: "Intermediate/Advanced",
      }
    ]
  },
];

export default function JadwalPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jadwal Latihan Perminggu</h1>
          <p className="mt-2 text-gray-600">
            Weekly training schedule for all classes and branches.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border">
            <option>Semua Cabang</option>
            <option>Jakarta Pusat</option>
            <option>Jakarta Selatan</option>
            <option>Bandung</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {schedule.map((day) => (
          <div key={day.day} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{day.day}</h3>
              <span className="bg-gray-200 text-gray-700 py-1 px-2 rounded-full text-xs font-medium">
                {day.classes.length} Kelas
              </span>
            </div>
            <div className="p-4 flex-1">
              {day.classes.length > 0 ? (
                <div className="space-y-4">
                  {day.classes.map((cls, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-md p-4 bg-gray-50/50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900">{cls.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium
                          ${cls.type === 'Beginner' ? 'bg-green-100 text-green-800' : 
                            cls.type === 'Intermediate' ? 'bg-blue-100 text-blue-800' : 
                            cls.type === 'Advanced' ? 'bg-purple-100 text-purple-800' : 
                            'bg-gray-200 text-gray-800'}`
                        }>
                          {cls.type}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          {cls.time}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          {cls.instructor}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          {cls.studio}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-8">
                  <CalendarIcon className="h-12 w-12 mb-2 opacity-20" />
                  <p>Tidak ada kelas</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
