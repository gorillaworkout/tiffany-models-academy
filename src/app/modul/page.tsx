import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const modules = [
  {
    id: "1",
    title: "Part 1: Introduction to Modelling",
    description: "Basic understanding of the modeling industry, types of modeling, and what it takes to succeed.",
    duration: "2 hours",
    status: "completed"
  },
  {
    id: "2",
    title: "Part 2: Posture and Body Awareness",
    description: "Developing core strength, correct posture, and body awareness essential for all types of modeling.",
    duration: "3 hours",
    status: "completed"
  },
  {
    id: "3",
    title: "Part 3: Basic Catwalk Techniques",
    description: "Learning the fundamental walk, foot placement, arm movement, and basic turns.",
    duration: "4 hours",
    status: "completed"
  },
  {
    id: "4",
    title: "Part 4: Facial Expressions",
    description: "Mastering your face: finding your angles, working with your eyes (smizing), and controlling expressions.",
    duration: "3 hours",
    status: "in_progress"
  },
  {
    id: "5",
    title: "Part 5: Posing Fundamentals",
    description: "Basic poses for commercial and fashion photography. Understanding body geometry.",
    duration: "4 hours",
    status: "locked"
  },
  {
    id: "6",
    title: "Part 6: Advanced Runway",
    description: "Pacing, rhythm, working with different garments, and advanced turns (half-turn, full-turn).",
    duration: "5 hours",
    status: "locked"
  },
  {
    id: "7",
    title: "Part 7: Editorial Posing",
    description: "Creating shapes, telling a story, and pushing boundaries for high-fashion editorial shoots.",
    duration: "4 hours",
    status: "locked"
  },
  {
    id: "8",
    title: "Part 8: Commercial Acting for Models",
    description: "Basic acting skills, reading scripts, and delivering lines for TV commercials.",
    duration: "4 hours",
    status: "locked"
  },
  {
    id: "9",
    title: "Part 9: Styling and Wardrobe",
    description: "Understanding fit, proportion, and how to showcase different types of clothing effectively.",
    duration: "2 hours",
    status: "locked"
  },
  {
    id: "10",
    title: "Part 10: Skincare and Makeup Basics",
    description: "Maintaining clear skin, basic grooming, and no-makeup makeup look for castings.",
    duration: "3 hours",
    status: "locked"
  },
  {
    id: "11",
    title: "Part 11: Fitness and Nutrition",
    description: "Healthy habits, workout routines tailored for models, and maintaining measurements safely.",
    duration: "2 hours",
    status: "locked"
  },
  {
    id: "12",
    title: "Part 12: The Casting Process",
    description: "How to prepare for castings, what to wear, etiquette, and dealing with rejection.",
    duration: "3 hours",
    status: "locked"
  },
  {
    id: "13",
    title: "Part 13: Building a Portfolio",
    description: "Understanding what makes a good comp card and how to build a versatile book.",
    duration: "2 hours",
    status: "locked"
  },
  {
    id: "14",
    title: "Part 14: Social Media for Models",
    description: "Building a personal brand, curating your feed, and attracting clients online.",
    duration: "2 hours",
    status: "locked"
  },
  {
    id: "15",
    title: "Part 15: Agency Contracts & Business",
    description: "Understanding representation, mother agencies, commission rates, and reading contracts.",
    duration: "3 hours",
    status: "locked"
  },
  {
    id: "16",
    title: "Part 16: Final Assessment & Mock Casting",
    description: "Comprehensive review of all skills through a simulated casting and test shoot.",
    duration: "6 hours",
    status: "locked"
  }
];

export default function ModulPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Detail Modul Modelling</h1>
        <p className="mt-2 text-gray-600">
          Complete all 16 parts of our comprehensive curriculum to graduate from Tiffany Models Academy.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <Accordion type="single" collapsible className="w-full">
          {modules.map((module) => (
            <AccordionItem key={module.id} value={module.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center space-x-4">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${module.status === "completed" ? "bg-green-100 text-green-700" : module.status === "in_progress" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                    {module.id}
                  </span>
                  <span className="font-semibold text-left">
                    {module.title}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6 pl-12">
                <p className="text-gray-600 mb-4">
                  {module.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">
                    Duration: {module.duration}
                  </span>
                  {module.status === "completed" && (
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Completed
                    </span>
                  )}
                  {module.status === "in_progress" && (
                    <button className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary/90">
                      Continue Learning
                    </button>
                  )}
                  {module.status === "locked" && (
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      Locked
                    </span>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
