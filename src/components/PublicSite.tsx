import { Header } from './Header';
import { Hero } from './Hero';
import { Catalog } from './Catalog';
import { Footer } from './Footer';
import { SocialFloat } from './SocialFloat';

type Props = {
  onAdminClick: () => void;
};

export function PublicSite({ onAdminClick }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onAdminClick={onAdminClick} />
      <Hero />
      <Catalog />
      <Footer />
      <SocialFloat />
    </div>
  );
}

