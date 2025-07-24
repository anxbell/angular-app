export class Document {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public url: string,
    public children: Document[],
    public price?: number,
    public brand?: string,
    public frameType?: string,
    public lensColor?: string,
    public uvProtection?: string,
    public imageUrl?: string
  ) {}
}