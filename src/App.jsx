import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FadeContent from './components/FadeContent';
import { fadeProps } from './components/fadeProps';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Hero />
        <FadeContent {...fadeProps}>
          <About />
        </FadeContent>
        <FadeContent {...fadeProps}>
          <Projects />
        </FadeContent>
        {/* Skills aplica el efecto a cada pipeline por separado (la sección es muy alta) */}
        <Skills />
        <FadeContent {...fadeProps}>
          <Contact />
        </FadeContent>
      </main>
      <FadeContent {...fadeProps}>
        <Footer />
      </FadeContent>
    </div>
  );
}

export default App;
