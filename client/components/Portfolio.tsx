import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Eye, Heart, MessageSquare } from 'lucide-react';
import { QuoteRequestModal } from './QuoteRequestModal';

export const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [quoteModal, setQuoteModal] = useState({ isOpen: false, projectTitle: '', projectCategory: '' });

  const portfolioItems = [
    {
      id: 1,
      title: 'Plateforme Éducative',
      category: 'web',
      description: 'Développement d\'une plateforme LMS complète avec système de gestion de cours et suivi des étudiants.',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      technologies: ['React', 'Node.js', 'MongoDB'],
      likes: 124,
      views: 2350,
    },
    {
      id: 2,
      title: 'Identité Visuelle TechStart',
      category: 'design',
      description: 'Création de l\'identité complète pour une startup technologique, incluant logo, charte graphique et supports.',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      technologies: ['Illustrator', 'Photoshop', 'InDesign'],
      likes: 89,
      views: 1670,
    },
    {
      id: 3,
      title: 'Boutique E-commerce',
      category: 'ecommerce',
      description: 'Site e-commerce complet avec système de paiement sécurisé, gestion de stocks et tableau de bord admin.',
      image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      technologies: ['Next.js', 'Stripe', 'PostgreSQL'],
      likes: 156,
      views: 3240,
    },
    {
      id: 4,
      title: 'Animation Produit 3D',
      category: 'motion',
      description: 'Vidéo promotionnelle avec animations 3D pour le lancement d\'un nouveau produit technologique.',
      image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      technologies: ['After Effects', 'Cinema 4D', 'Premiere'],
      likes: 203,
      views: 4120,
    },
    {
      id: 5,
      title: 'Application Mobile Finance',
      category: 'mobile',
      description: 'Application mobile de gestion financière avec tableau de bord interactif et notifications intelligentes.',
      image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      technologies: ['React Native', 'Firebase', 'Chart.js'],
      likes: 178,
      views: 2890,
    },
    {
      id: 6,
      title: 'Packaging Bio Collection',
      category: 'design',
      description: 'Conception de l\'identité visuelle et packaging pour une gamme de produits bio et écologiques.',
      image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      technologies: ['Illustrator', 'Photoshop', '3D Modeling'],
      likes: 145,
      views: 2340,
    },
  ];

  const filters = [
    { id: 'all', label: 'Tous', count: portfolioItems.length },
    { id: 'web', label: 'Web', count: portfolioItems.filter(item => item.category === 'web').length },
    { id: 'design', label: 'Design', count: portfolioItems.filter(item => item.category === 'design').length },
    { id: 'ecommerce', label: 'E-commerce', count: portfolioItems.filter(item => item.category === 'ecommerce').length },
    { id: 'motion', label: 'Motion', count: portfolioItems.filter(item => item.category === 'motion').length },
    { id: 'mobile', label: 'Mobile', count: portfolioItems.filter(item => item.category === 'mobile').length },
  ];

  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 relative inline-block">
            Nos Réalisations
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-accent rounded-full"></div>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Découvrez une sélection de nos projets récents qui illustrent notre expertise et notre créativité
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-primary text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
              <span className="ml-2 text-sm opacity-75">({filter.count})</span>
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Action buttons */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                  <div className="flex space-x-3">
                    <button
                      className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-110 border border-white/30"
                      title="Voir les détails"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => setQuoteModal({
                        isOpen: true,
                        projectTitle: item.title,
                        projectCategory: item.category
                      })}
                      className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-accent hover:text-black transition-all duration-300 transform hover:scale-110 border border-white/30"
                      title="Demander un devis"
                    >
                      <MessageSquare size={20} />
                    </button>
                    <button
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-green-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                      title="Voir le projet"
                    >
                      <ExternalLink size={20} />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
                    <Heart size={14} />
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
                    <Eye size={14} />
                    <span>{item.views}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {item.description}
                </p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-xs font-medium rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-accent text-black text-xs font-bold rounded-full uppercase tracking-wide">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="inline-block bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Vous avez un projet en tête ?
            </h3>
            <p className="text-gray-600 mb-6">
              Travaillons ensemble pour donner vie à vos idées les plus créatives
            </p>
            <Link
              to="/#contact"
              className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-block"
            >
              Démarrer un projet
            </Link>
          </div>
        </div>

        {/* Quote Request Modal */}
        <QuoteRequestModal
          isOpen={quoteModal.isOpen}
          onClose={() => setQuoteModal({ isOpen: false, projectTitle: '', projectCategory: '' })}
          projectTitle={quoteModal.projectTitle}
          projectCategory={quoteModal.projectCategory}
        />
      </div>
    </section>
  );
};
