import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

  export default function ProjectProgress({ projects }: { projects: { name: string, progress: number }[] }) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Project Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {projects.map((project, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{project.name}</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}