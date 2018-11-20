import { DrawContext } from "../../../ts/gamelib/1Common/DrawContext";

export function DrawPanel(drawContext: DrawContext): void {
    let factor: number = this.model.value / (this.model.max - this.model.min);

    if (this.model.enabled) {
        drawContext.fillRect(this.location.x + 10, this.location.y, 2, 2);
    }
    drawContext.drawText(this.location.x+20, this.location.y+this.fontSize, this.model.name, this.fontSize, this.font);
    drawContext.fillRect(this.location.x + 140, this.location.y, this.width * factor, 10);
    drawContext.drawText(this.location.x + 160 + this.width,
        this.location.y + this.fontSize, this.model.value.toString(), this.fontSize, this.font);
}
