export interface Contact {
  name: string;
  location: string;
  phone: string;
  email: string;
  linkedIn: string;
  github: string;
  avatar: { url: string } | null;
}

export interface ContactData {
  cvContact: Contact;
}
