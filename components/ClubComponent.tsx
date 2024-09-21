import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Zap, Crown, Clock, Mail, Check, MessageCircle, Users, Video, Lightbulb } from 'lucide-react'

const membershipPlans = [
  { 
    name: 'Bronze', 
    price: 5, 
    icon: <Shield className="h-8 w-8 mb-2 text-orange-400" />,
    benefits: [
      { text: 'Early access to content', icon: <Clock className="h-4 w-4 mr-2" /> },
      { text: 'Monthly newsletter', icon: <Mail className="h-4 w-4 mr-2" /> }
    ]
  },
  { 
    name: 'Silver', 
    price: 10, 
    icon: <Zap className="h-8 w-8 mb-2 text-gray-400" />,
    benefits: [
      { text: 'Bronze benefits', icon: <Check className="h-4 w-4 mr-2" /> },
      { text: 'Exclusive Discord access', icon: <MessageCircle className="h-4 w-4 mr-2" /> },
      { text: 'Quarterly Q&A session', icon: <Users className="h-4 w-4 mr-2" /> }
    ]
  },
  { 
    name: 'Gold', 
    price: 20, 
    icon: <Crown className="h-8 w-8 mb-2 text-yellow-500" />,
    benefits: [
      { text: 'Silver benefits', icon: <Check className="h-4 w-4 mr-2" /> },
      { text: 'Personal thank you video', icon: <Video className="h-4 w-4 mr-2" /> },
      { text: 'Input on future projects', icon: <Lightbulb className="h-4 w-4 mr-2" /> }
    ]
  },
]

export default function ClubComponent() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 tracking-tight">Join Our Club</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Become a member and get exclusive benefits to support your favorite creator.</p>
      {/* Recurring Membership Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {membershipPlans.map((plan, index) => (
          <Card key={index} className="bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 p-6 text-center">
              <div className="flex justify-center">{plan.icon}</div>
              <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
              <p className="text-3xl font-semibold">${plan.price}<span className="text-base font-normal">/month</span></p>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-4">
                {plan.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    {benefit.icon}
                    {benefit.text}
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6 bg-black dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-400 rounded-xl">
                Subscribe to {plan.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}