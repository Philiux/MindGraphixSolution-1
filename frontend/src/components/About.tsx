import React from 'react'

const About: React.FC = () => {
  const stats = [
    { number: "50+", label: "Projets réalisés" },
    { number: "5+", label: "Années d'expérience" },
    { number: "100%", label: "Clients satisfaits" },
    { number: "15+", label: "Experts talentueux" }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-high-contrast">
            À Propos de MindGraphix
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
            Nous sommes une agence passionnée qui transforme vos idées en solutions digitales exceptionnelles. 
            Notre équipe d'experts combine créativité et expertise technique pour créer des expériences 
            utilisateur mémorables et des produits digitaux performants.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold stat-number mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-high-contrast">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-high-contrast">
              Notre Philosophie
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Chez MindGraphix, nous croyons que chaque projet est unique. Nous prenons le temps de 
              comprendre vos objectifs, votre public et votre vision pour créer des solutions sur mesure 
              qui dépassent vos attentes et propulsent votre entreprise vers l'avant.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
