"use client";

import React from 'react'
import AnimatedList from './animatedList'

const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10']; 
  
<AnimatedList
  items={items}
  onItemSelect={(item, index) => console.log(item, index)}
  showGradients={true}
  enableArrowNavigation={true}
  displayScrollbar={true}
/>


 const LeaderboardComp = () => {
  return (
    <div className='bg-black'>
      
      <AnimatedList/>
    </div>
  )
}

export default LeaderboardComp

