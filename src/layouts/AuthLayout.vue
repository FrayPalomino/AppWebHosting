<template>
    <q-layout view="hHh lpR fFf">
      <div class="floating-shapes">
        <div class="shape circle shape-1"></div>
        <div class="shape circle shape-2"></div>
        <div class="shape circle shape-3"></div>
        
        <div class="shape triangle shape-4"></div>
        <div class="shape triangle shape-5"></div>
        
        <div class="shape rectangle shape-6"></div>
        <div class="shape rectangle shape-7"></div>
        
        <div class="shape hexagon shape-8"></div>
        <div class="shape hexagon shape-9"></div>
        
        <div class="shape diamond shape-10"></div>
        <div class="shape diamond shape-11"></div>
      </div>
      
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </template>
  
  <script setup>

  </script>
  
  <style scoped>
  .floating-shapes {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    overflow: hidden;
  }
  
  .shape {
    position: absolute;
    opacity: 0.1;
    animation: float 20s infinite linear;
  }
  
  .circle {
    border-radius: 50%;
  }
  
  .shape-1 {
    width: 60px;
    height: 60px;
    background: linear-gradient(45deg, #6b7280, #9ca3af);
    top: 10%;
    left: 15%;
    animation-duration: 25s;
  }
  
  .shape-2 {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #10b981, #059669);
    top: 60%;
    right: 20%;
    animation-duration: 30s;
    animation-delay: -5s;
  }
  
  .shape-3 {
    width: 40px;
    height: 40px;
    background: linear-gradient(90deg, #d1d5db, #f3f4f6);
    top: 30%;
    right: 10%;
    animation-duration: 35s;
    animation-delay: -10s;
  }
  
  .triangle {
    width: 0;
    height: 0;
  }
  
  .shape-4 {
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    border-bottom: 45px solid #6b7280;
    top: 20%;
    left: 60%;
    animation-duration: 28s;
    animation-delay: -3s;
  }
  
  .shape-5 {
    border-left: 30px solid transparent;
    border-right: 30px solid transparent;
    border-bottom: 50px solid #10b981;
    top: 70%;
    left: 10%;
    animation-duration: 32s;
    animation-delay: -8s;
  }
  
  .rectangle {
    border-radius: 4px;
  }
  
  .shape-6 {
    width: 70px;
    height: 35px;
    background: linear-gradient(45deg, #9ca3af, #d1d5db);
    top: 40%;
    left: 25%;
    animation-duration: 26s;
    animation-delay: -2s;
  }
  
  .shape-7 {
    width: 50px;
    height: 25px;
    background: linear-gradient(135deg, #059669, #047857);
    top: 80%;
    right: 30%;
    animation-duration: 29s;
    animation-delay: -7s;
  }
  
  .hexagon {
    width: 50px;
    height: 28px;
    background: #6b7280;
    position: relative;
    margin: 14px 0;
  }
  
  .hexagon:before,
  .hexagon:after {
    content: "";
    position: absolute;
    width: 0;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
  }
  
  .hexagon:before {
    bottom: 100%;
    border-bottom: 14px solid #6b7280;
  }
  
  .hexagon:after {
    top: 100%;
    border-top: 14px solid #6b7280;
  }
  
  .shape-8 {
    top: 15%;
    right: 40%;
    animation-duration: 31s;
    animation-delay: -4s;
  }
  
  .shape-9 {
    background: #10b981;
    top: 50%;
    left: 40%;
    animation-duration: 27s;
    animation-delay: -9s;
  }
  
  .shape-9:before {
    border-bottom-color: #10b981;
  }
  
  .shape-9:after {
    border-top-color: #10b981;
  }
  
  .diamond {
    width: 40px;
    height: 40px;
    background: #9ca3af;
    transform: rotate(45deg);
  }
  
  .shape-10 {
    top: 25%;
    left: 80%;
    animation-duration: 33s;
    animation-delay: -6s;
  }
  
  .shape-11 {
    background: #10b981;
    top: 65%;
    left: 70%;
    animation-duration: 24s;
    animation-delay: -11s;
  }
  
  @keyframes float {
    0% {
      transform: translateY(0px) rotate(0deg);
      opacity: 0.1;
    }
    50% {
      opacity: 0.3;
    }
    100% {
      transform: translateY(-100vh) rotate(360deg);
      opacity: 0;
    }
  }
  
  .shape-1, .shape-3, .shape-6, .shape-8, .shape-10 {
    animation-name: float-left;
  }
  
  .shape-2, .shape-4, .shape-7, .shape-9, .shape-11 {
    animation-name: float-right;
  }
  
  @keyframes float-left {
    0% {
      transform: translateY(0px) translateX(0px) rotate(0deg);
      opacity: 0.1;
    }
    25% {
      transform: translateY(-25vh) translateX(-20px) rotate(90deg);
      opacity: 0.2;
    }
    50% {
      transform: translateY(-50vh) translateX(10px) rotate(180deg);
      opacity: 0.3;
    }
    75% {
      transform: translateY(-75vh) translateX(-10px) rotate(270deg);
      opacity: 0.2;
    }
    100% {
      transform: translateY(-100vh) translateX(20px) rotate(360deg);
      opacity: 0;
    }
  }
  
  @keyframes float-right {
    0% {
      transform: translateY(0px) translateX(0px) rotate(0deg);
      opacity: 0.1;
    }
    25% {
      transform: translateY(-25vh) translateX(20px) rotate(-90deg);
      opacity: 0.2;
    }
    50% {
      transform: translateY(-50vh) translateX(-10px) rotate(-180deg);
      opacity: 0.3;
    }
    75% {
      transform: translateY(-75vh) translateX(10px) rotate(-270deg);
      opacity: 0.2;
    }
    100% {
      transform: translateY(-100vh) translateX(-20px) rotate(-360deg);
      opacity: 0;
    }
  }
  
  @media (max-width: 768px) {
    .shape {
      opacity: 0.05;
    }
    
    .shape-1, .shape-2, .shape-3 {
      width: 30px;
      height: 30px;
    }
    
    .shape-4 {
      border-left-width: 15px;
      border-right-width: 15px;
      border-bottom-width: 25px;
    }
    
    .shape-5 {
      border-left-width: 20px;
      border-right-width: 20px;
      border-bottom-width: 35px;
    }
    
    .shape-6, .shape-7 {
      width: 40px;
      height: 20px;
    }
    
    .hexagon {
      width: 30px;
      height: 17px;
    }
    
    .hexagon:before,
    .hexagon:after {
      border-left-width: 15px;
      border-right-width: 15px;
    }
    
    .hexagon:before {
      border-bottom-width: 8px;
    }
    
    .hexagon:after {
      border-top-width: 8px;
    }
    
    .diamond {
      width: 25px;
      height: 25px;
    }
  }
  </style>
  