import React from 'react'

const Hero: React.FC = () => {
  return (
    <section className="hero-section min-h-screen flex items-center justify-center text-white">
      <div className="text-center px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          MindGraphix
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl mb-10 max-w-3xl mx-auto leading-relaxed">
          Votre agence de design et développement digital innovant
        </p>
        <button className="btn-primary text-lg md:text-xl px-10 py-4 rounded-xl shadow-lg hover:shadow-xl">
          Démarrer un projet
        </button>
      </div>
    </section>
  )
}

export default Hero
