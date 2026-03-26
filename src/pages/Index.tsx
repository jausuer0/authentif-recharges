import { Button } from "@/components/ui/button";
import RechargeForm from "@/components/RechargeForm";
import heroImage from "@/assets/hero-recharge.png";
import { ShieldCheck } from "lucide-react";

const Index = () => {
  const scrollToForm = () => {
    document.getElementById("recharge-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Left: Text */}
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold">
                <ShieldCheck className="w-4 h-4" />
                Sécurisé &amp; Rapide
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
                Rechargez en
                <span className="text-primary"> toute confiance</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
               Un service support ultra rapide pour authentifier vos tickets de recharge mobile. Ne laissez plus le doute gâcher votre expérience de recharge.
              </p>
              <Button size="lg" onClick={scrollToForm} className="text-base px-8 py-6 shadow-lg shadow-primary/25">
                Authentifier votre ticket
              </Button>
            </div>

            {/* Right: Image */}
            <div className="flex-1 flex justify-center">
              <img
                src="https://static.rapido.com/cms/sites/24/2024/07/12123029/Transcash.png"
                alt="Recharge mobile"
                width={800}
                height={800}
                className="w-full max-w-md drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="recharge-form" className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-3">Formulaire de recharge</h2>
            <p className="text-muted-foreground">
              Remplissez les informations ci-dessous pour authentifier votre ticket.
            </p>
          </div>
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
            <RechargeForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
