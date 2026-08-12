<template>
  <canvas ref="canvasRef" class="sakura-canvas"></canvas>
</template>

<script setup lang="ts">
// 樱花飘落动效：参考 nekro.top 实现
// 使用真实花瓣 PNG 图片 + Canvas drawImage 绘制，比矢量曲线更自然
// 支持自适应窗口尺寸、标签页隐藏时暂停以节省资源
interface PetalMotion {
  // eslint-disable-next-line no-unused-vars -- Parameter labels document each motion function contract.
  x(value: number): number;
  // eslint-disable-next-line no-unused-vars -- Parameter labels document each motion function contract.
  y(value: number): number;
  // eslint-disable-next-line no-unused-vars -- Parameter labels document each motion function contract.
  r(value: number): number;
}

const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let animationId: number | null = null;
let petals: Petal[] = [];
let width = 0;
let height = 0;
let sakuraImg: HTMLImageElement | null = null;
let imgReady = false;

// 花瓣数量
const COUNT = 50;

// 生成单个花瓣固定的运动参数（nekro.top 同款运动逻辑）
const makeFn = (): PetalMotion => {
  // x 方向：每帧 x += 0.5*nx - 1.7，nx ∈ [-0.5, 0.5]，整体向左漂移
  const nx = Math.random() - 0.5;
  // y 方向：每帧 y += ny，ny ∈ [1.5, 2.2]，下落
  const ny = 1.5 + 0.7 * Math.random();
  // 旋转：每帧 r += nr，nr ∈ [0, 0.03]，缓慢自转
  const nr = 0.03 * Math.random();
  return {
    x: (x: number) => x + 0.5 * nx - 1.7,
    y: (y: number) => y + ny,
    r: (r: number) => r + nr,
  };
};

class Petal {
  declare x: number;
  declare y: number;
  declare s: number;
  declare r: number;
  declare fn: PetalMotion;

  constructor(spreadInScreen = false) {
    this.reset(spreadInScreen);
  }
  // spreadInScreen=true：初始随机分布在屏幕内（首次加载铺满屏幕）
  // spreadInScreen=false：从屏幕外重生
  reset(spreadInScreen = false) {
    if (spreadInScreen) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    } else {
      // 60% 从顶部重生，40% 从右侧重生
      if (Math.random() > 0.4) {
        this.x = Math.random() * width;
        this.y = -20;
      } else {
        this.x = width + 20;
        this.y = Math.random() * height;
      }
    }
    // 缩放 0.3~1.0，保证所有花瓣可见且有远近层次
    this.s = 0.3 + 0.7 * Math.random();
    // 初始旋转 0~6（约一圈）
    this.r = 6 * Math.random();
    this.fn = makeFn();
  }
  update() {
    this.x = this.fn.x(this.x);
    this.y = this.fn.y(this.y);
    this.r = this.fn.r(this.r);
    // 飘出屏幕则重生
    if (this.x > width + 20 || this.x < -20 || this.y > height + 20) {
      this.reset(false);
    }
  }
  draw(ctx: CanvasRenderingContext2D): void {
    if (!imgReady) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.r);
    // 原图为 40x40 区域，按缩放绘制
    ctx.drawImage(sakuraImg!, 0, 0, 40 * this.s, 40 * this.s);
    ctx.restore();
  }
}

// 调整画布尺寸（处理 DPR 以保证高清屏清晰）
const resize = () => {
  const canvas = canvasRef.value!;
  const context = ctx!;
  const dpr = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
};

// 动画循环
const animate = () => {
  const context = ctx!;
  context.clearRect(0, 0, width, height);
  for (const petal of petals) {
    petal.update();
    petal.draw(context);
  }
  animationId = requestAnimationFrame(animate);
};

const start = () => {
  if (animationId || !imgReady) return;
  animationId = requestAnimationFrame(animate);
};

const stop = () => {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
};

onMounted(() => {
  ctx = canvasRef.value!.getContext("2d");
  resize();
  // 加载花瓣图片
  sakuraImg = new Image();
  const image = sakuraImg;
  image.src = "/images/sakura.png";
  image.onload = () => {
    imgReady = true;
    // 图片就绪后创建花瓣并启动动画（初始铺满屏幕）
    petals = Array.from({ length: COUNT }, () => new Petal(true));
    start();
  };

  window.addEventListener("resize", resize);
  // 标签页隐藏时暂停，节省资源
  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
  });
});

onBeforeUnmount(() => {
  stop();
  window.removeEventListener("resize", resize);
});
</script>

<style lang="scss" scoped>
.sakura-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; // 不阻挡点击
  z-index: 0; // 在背景图之上、内容之下
}
</style>
