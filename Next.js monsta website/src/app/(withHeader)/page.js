import React from 'react'
import Slider from './componets/home/Slider'
import FeatureProduct from './componets/home/FeatureProduct'
import BestSelling from './componets/home/BestSelling'
import CustomerSays from './componets/home/CustomerSays'

export default function page() {
  return (
    <>
      <div>
        <Slider/>
        <FeatureProduct/>
        <BestSelling/>
        <CustomerSays/>
      </div>
    </>
  )
}

