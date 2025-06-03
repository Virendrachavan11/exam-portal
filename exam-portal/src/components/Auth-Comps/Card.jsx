import React from 'react'
import { ShieldCheck, BarChart, UserPlus } from "lucide-react";

const Card = ({title,para}) => {
  return (
    <div className="shadow-lg p-6 rounded-2xl border-t-4 border-orange-500 transform transition-transform hover:scale-105">
    <ShieldCheck className="w-12 h-12 mx-auto text-orange-500 mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p>{para}</p>
  </div>
  )
}

export default Card
