import { Entity } from '../entities/Entity';

export class SpriteLoader {
    private spriteCache: Map<string, HTMLImageElement>;

    constructor() {
        this.spriteCache = new Map();
    }

    public loadSprite(spritePath: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            if (this.spriteCache.has(spritePath)) {
                resolve(this.spriteCache.get(spritePath)!);
                return;
            }

            const img = new Image();
            img.src = spritePath;
            img.onload = () => {
                this.spriteCache.set(spritePath, img);
                resolve(img);
            };
            img.onerror = () => {
                reject(new Error(`Failed to load sprite at ${spritePath}`));
            };
        });
    }

    public getSprite(spritePath: string): HTMLImageElement | undefined {
        return this.spriteCache.get(spritePath);
    }

    public clearCache(): void {
        this.spriteCache.clear();
    }
}