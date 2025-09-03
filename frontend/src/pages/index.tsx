import { NextPage } from 'next'
import Head from 'next/head'
import { Suspense, lazy } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'

const Hero = lazy(() => import('../components/Hero'))
const Services = lazy(() => import('../components/Services'))
const Portfolio = lazy(() => import('../components/Portfolio'))
const About = lazy(() => import('../components/About'))
const Contact = lazy(() => import('../components/Contact'))

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>MindGraphix - Agence de Design et Développement</title>
        <meta name="description" content="Agence spécialisée en design graphique, développement web et solutions digitales innovantes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <main className="min-h-screen">
        <Suspense fallback={<LoadingSpinner />}>
          <Hero />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <Services />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <Portfolio />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <About />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <Contact />
        </Suspense>
      </main>
    </>
  )
}

export default Home
