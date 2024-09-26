import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Anvil } from "lucide-react"
import { ReactNode } from "react"

interface ProjectDetail {
  title: string
  content: string
  icon: ReactNode
}

interface ProjectDetailsProps {
  projectDetails: ProjectDetail[]
  openAccordionItem: string
  setOpenAccordionItem: (value: string) => void
}

export default function ProjectDetails({ projectDetails, openAccordionItem, setOpenAccordionItem }: ProjectDetailsProps) {
  return (
    <Card className="mb-8 bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm border shadow rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="tracking-tight flex items-center text-2xl">
          <Anvil className="mr-2 h-6 w-6 text-red-500" />
          The Project
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion
          type="single" 
          collapsible
          value={openAccordionItem}
          onValueChange={setOpenAccordionItem}
        >
          {projectDetails.map((detail, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className='hover:no-underline'>
                <div className="flex items-center">
                  {detail.icon}
                  <span className="ml-2">{detail.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>{detail.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}