import React from 'react'

const Portfolio: React.FC = () => {
  const projects = [
    {
      title: "Site E-commerce Luxe",
      description: "Plateforme e-commerce haut de gamme avec interface intuitive et paiements sécurisés",
      category: "Développement Web"
    },
    {
      title: "Identité Visuelle Corporate",
      description: "Refonte complète de l'identité visuelle pour une entreprise internationale",
      category: "Design Graphique"
    },
    {
      title: "Application Mobile",
      description: "Application mobile native avec fonctionnalités avancées et design ergonomique",
      category: "Développement Mobile"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-high-contrast">
          Nos Réalisations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100 hover-lift">
              <div className="mb-6">
                <span className="badge-primary">
                  {project.category}
                </span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-high-contrast">
                {project.title}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {project.description}
              </p>
              <button className="mt-6 text-primary hover:text-primary-dark font-semibold transition-colors flex items-center">
                Voir le projet 
                <span className="ml-2">→</span>
              </button>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button className="btn-primary px-8 py-3 rounded-xl">
            Voir tous nos projets
          </button>
        </div>
      </div>
    </section>
  )
}

export default Portfolio
