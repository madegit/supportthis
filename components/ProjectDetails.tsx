"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Anvil } from "lucide-react"
import type { ReactNode } from "react"

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

export default function ProjectDetails({
  projectDetails,
  openAccordionItem,
  setOpenAccordionItem,
}: ProjectDetailsProps) {
  return (
    <Card className="mb-8 bg-white dark:bg-[#121212] bg-opacity-50 dark:bg-opacity-100 backdrop-blur-sm border dark:border-gray-800 shadow rounded-xl">
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
          className="w-full"
        >
          {projectDetails.map((detail, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b dark:border-gray-700">
              <AccordionTrigger className="hover:no-underline dark:text-white hover:text-red-500 dark:hover:text-red-400">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">{detail.icon}</span>
                  <span className="ml-2">{detail.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="dark:text-gray-300 text-gray-700 pt-2 pb-4">
                {detail.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
