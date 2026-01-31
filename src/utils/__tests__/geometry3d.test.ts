import { describe, it, expect } from 'vitest';
import { Rect3D, createRect3D } from '../geometry';
import { Vector3 } from '../transform3d';

describe('Rect3D', () => {
  describe('Construction', () => {
    it('should create 3D rect with default position', () => {
      const rect = new Rect3D(100, 200, 300);
      
      expect(rect.width).toBe(100);
      expect(rect.height).toBe(200);
      expect(rect.depth).toBe(300);
      expect(rect.x).toBe(0);
      expect(rect.y).toBe(0);
      expect(rect.z).toBe(0);
    });

    it('should create 3D rect with position', () => {
      const rect = new Rect3D(100, 200, 300, 10, 20, 30);
      
      expect(rect.width).toBe(100);
      expect(rect.height).toBe(200);
      expect(rect.depth).toBe(300);
      expect(rect.x).toBe(10);
      expect(rect.y).toBe(20);
      expect(rect.z).toBe(30);
    });

    it('should create via factory function', () => {
      const rect = createRect3D(100, 200, 300, 10, 20, 30);
      
      expect(rect.width).toBe(100);
      expect(rect.height).toBe(200);
      expect(rect.depth).toBe(300);
      expect(rect.x).toBe(10);
      expect(rect.y).toBe(20);
      expect(rect.z).toBe(30);
    });
  });

  describe('Bounds', () => {
    it('should calculate front/near', () => {
      const rect = new Rect3D(100, 200, 300, 0, 0, 50);
      
      expect(rect.front).toBe(50);
      expect(rect.near).toBe(50);
    });

    it('should calculate back/far', () => {
      const rect = new Rect3D(100, 200, 300, 0, 0, 50);
      
      expect(rect.back).toBe(350);
      expect(rect.far).toBe(350);
    });

    it('should calculate centerZ', () => {
      const rect = new Rect3D(100, 200, 300, 0, 0, 50);
      
      expect(rect.centerZ).toBe(200);
    });

    it('should calculate 3D center', () => {
      const rect = new Rect3D(100, 200, 300, 0, 0, 0);
      const center = rect.center3D;
      
      expect(center.x).toBe(50);
      expect(center.y).toBe(100);
      expect(center.z).toBe(150);
    });

    it('should inherit 2D bounds', () => {
      const rect = new Rect3D(100, 200, 300, 10, 20, 30);
      
      expect(rect.left).toBe(10);
      expect(rect.right).toBe(110);
      expect(rect.top).toBe(20);
      expect(rect.bottom).toBe(220);
      expect(rect.cx).toBe(60);
      expect(rect.cy).toBe(120);
    });
  });

  describe('Volume', () => {
    it('should calculate volume', () => {
      const rect = new Rect3D(10, 20, 30);
      
      expect(rect.volume).toBe(6000);
    });

    it('should calculate volume with position', () => {
      const rect = new Rect3D(5, 5, 5, 100, 200, 300);
      
      expect(rect.volume).toBe(125);
    });
  });

  describe('Position Resolution', () => {
    it('should resolve center keyword', () => {
      const rect = new Rect3D(100, 200, 300, 0, 0, 0);
      const point = rect.resolvePoint3D('center');
      
      expect(point.x).toBe(50);
      expect(point.y).toBe(100);
      expect(point.z).toBe(150);
    });

    it('should resolve 2D keywords with center Z', () => {
      const rect = new Rect3D(100, 200, 300, 0, 0, 0);
      
      const top = rect.resolvePoint3D('top');
      expect(top.x).toBe(50);
      expect(top.y).toBe(0);
      expect(top.z).toBe(150);
      
      const left = rect.resolvePoint3D('left');
      expect(left.x).toBe(0);
      expect(left.y).toBe(100);
      expect(left.z).toBe(150);
    });

    it('should resolve 3D keywords', () => {
      const rect = new Rect3D(100, 200, 300, 0, 0, 0);
      
      const front = rect.resolvePoint3D('front');
      expect(front.x).toBe(50);
      expect(front.y).toBe(100);
      expect(front.z).toBe(0);
      
      const back = rect.resolvePoint3D('back');
      expect(back.x).toBe(50);
      expect(back.y).toBe(100);
      expect(back.z).toBe(300);
    });

    it('should resolve corner keywords', () => {
      const rect = new Rect3D(100, 200, 300, 0, 0, 0);
      
      const topLeftFront = rect.resolvePoint3D('topLeftFront');
      expect(topLeftFront.x).toBe(0);
      expect(topLeftFront.y).toBe(0);
      expect(topLeftFront.z).toBe(0);
      
      const bottomRightBack = rect.resolvePoint3D('bottomRightBack');
      expect(bottomRightBack.x).toBe(100);
      expect(bottomRightBack.y).toBe(200);
      expect(bottomRightBack.z).toBe(300);
    });

    it('should resolve tuple positions', () => {
      const rect = new Rect3D(100, 200, 300, 0, 0, 0);
      const point = rect.resolvePoint3D([50, 100, 150]);
      
      expect(point.x).toBe(50);
      expect(point.y).toBe(100);
      expect(point.z).toBe(150);
    });

    it('should resolve percentage tuples', () => {
      const rect = new Rect3D(100, 200, 300, 0, 0, 0);
      const point = rect.resolvePoint3D(['50%', '50%', '50%']);
      
      expect(point.x).toBe(50);
      expect(point.y).toBe(100);
      expect(point.z).toBe(150);
    });

    it('should resolve object positions', () => {
      const rect = new Rect3D(100, 200, 300, 0, 0, 0);
      const point = rect.resolvePoint3D({ x: 25, y: 50, z: 75 });
      
      expect(point.x).toBe(25);
      expect(point.y).toBe(50);
      expect(point.z).toBe(75);
    });

    it('should resolve percentage object positions', () => {
      const rect = new Rect3D(100, 200, 300, 0, 0, 0);
      const point = rect.resolvePoint3D({ x: '25%', y: '25%', z: '25%' });
      
      expect(point.x).toBe(25);
      expect(point.y).toBe(50);
      expect(point.z).toBe(75);
    });

    it('should resolve Vector3 directly', () => {
      const rect = new Rect3D(100, 200, 300, 0, 0, 0);
      const input = new Vector3(10, 20, 30);
      const point = rect.resolvePoint3D(input);
      
      expect(point.x).toBe(10);
      expect(point.y).toBe(20);
      expect(point.z).toBe(30);
      
      expect(point).not.toBe(input);
    });

    it('should handle offset positions', () => {
      const rect = new Rect3D(100, 200, 300, 50, 100, 150);
      const point = rect.resolvePoint3D([0, 0, 0]);
      
      expect(point.x).toBe(50);
      expect(point.y).toBe(100);
      expect(point.z).toBe(150);
    });
  });
});
