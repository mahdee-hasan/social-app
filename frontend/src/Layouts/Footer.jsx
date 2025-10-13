import { Facebook, Github, Linkedin, Mail } from "lucide-react";
import React from "react";
import { BsWhatsapp } from "react-icons/bs";

const Footer = () => {
  const navItems = [
    {
      sr: 1,
      icon: Facebook,
      to: "https://www.facebook.com/mah.dee.767845",
      title: "facebook",
    },
    {
      sr: 2,
      icon: Github,
      to: "https://github.com/mahdee-hasan",
      title: "github",
    },
    {
      sr: 3,
      icon: Mail,
      to: "mailto:mahdeeh45@gmail.com",
      title: "google",
    },
    {
      sr: 4,
      icon: BsWhatsapp,
      to: "https://wa.me/8801862402594",
      title: "whatsapp",
    },
    {
      sr: 5,
      icon: Linkedin,
      to: "https://linkedin.com/",
      title: "linkedin",
    },
  ];
  return (
    <div className="w-full h-24 bg-black/70 p-1">
      <div className=" flex space-y-1 justify-center flex-col max-w-3xl mx-auto">
        <p className="text-center">contact with developer</p>
        <div className="flex w-full justify-between items-center">
          {navItems.map((items) => (
            <a href={items.to} title={items.title} key={items.sr}>
              <items.icon className="h-8 w-8 text-[32px]" />
            </a>
          ))}
        </div>
        <p className="text-right">developed by mahdee hasan</p>
      </div>
    </div>
  );
};

export default Footer;
