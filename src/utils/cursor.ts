type Point = {
  x: number;
  y: number;
};

type CursorPosition = {
  curr: Point | null;
  prev: Point | null;
};

const lerp = (a: number, b: number, n: number): number => {
  if (Math.round(a) === b) {
    return b;
  }
  return (1 - n) * a + n * b;
};

const cursorInit = (): Cursor => {
  return new Cursor();
};

class Cursor {
  declare cursor: HTMLDivElement;
  declare scr: HTMLStyleElement;
  pos: CursorPosition;
  rafId: number | null;

  constructor() {
    this.pos = {
      curr: null,
      prev: null,
    };
    this.rafId = null;
    this.create();
    this.init();
    this.render();
  }

  move(left: number, top: number): void {
    this.cursor.style["left"] = `${left}px`;
    this.cursor.style["top"] = `${top}px`;
  }

  create(): void {
    if (!this.cursor) {
      this.cursor = document.createElement("div");
      this.cursor.id = "cursor";
      this.cursor.classList.add("xs-hidden");
      this.cursor.classList.add("hidden");
      document.body.append(this.cursor);
    }

    document.body.appendChild((this.scr = document.createElement("style")));
    this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='10px' height='10px'><circle cx='4' cy='4' r='4' fill='white' /></svg>") 4 4, auto !important}`;
  }

  init(): void {
    // 使用 addEventListener，避免 onmousemove 属性赋值覆盖页面其他同事件处理
    document.addEventListener("mousemove", (e: MouseEvent) => {
      if (this.pos.curr == null) this.move(e.clientX - 8, e.clientY - 8);
      this.pos.curr = {
        x: e.clientX - 8,
        y: e.clientY - 8,
      };
      this.cursor.classList.remove("hidden");
      if (!this.rafId) {
        this.rafId = requestAnimationFrame(() => this.render());
      }
    });
    document.addEventListener("mouseenter", () => this.cursor.classList.remove("hidden"));
    document.addEventListener("mouseleave", () => this.cursor.classList.add("hidden"));
    document.addEventListener("mousedown", () => this.cursor.classList.add("active"));
    document.addEventListener("mouseup", () => this.cursor.classList.remove("active"));
  }

  render(): void {
    this.rafId = null;
    // 鼠标还未移动过（pos.curr 为 null），等待 mousemove 触发后再渲染
    if (!this.pos.curr) {
      return;
    }
    if (this.pos.prev) {
      this.pos.prev.x = lerp(this.pos.prev.x, this.pos.curr.x, 0.35);
      this.pos.prev.y = lerp(this.pos.prev.y, this.pos.curr.y, 0.35);
      this.move(this.pos.prev.x, this.pos.prev.y);
    } else {
      this.pos.prev = { x: this.pos.curr.x, y: this.pos.curr.y };
    }
    // 简单坐标比较替代 lodash isEqual
    if (
      Math.round(this.pos.prev.x) !== Math.round(this.pos.curr.x) ||
      Math.round(this.pos.prev.y) !== Math.round(this.pos.curr.y)
    ) {
      this.rafId = requestAnimationFrame(() => this.render());
    }
  }
}

export default cursorInit;
