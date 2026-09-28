import { AIPresenter } from '../../types';

export class PresenterAvatarRenderer {
  /**
   * Renders full-frame presenter in a high-aesthetic lifestyle/studio environment
   */
  static renderFullPresenter(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    presenter: AIPresenter,
    environmentTheme: string,
    isSpeaking: boolean,
    currentTime: number
  ) {
    ctx.save();

    // 1. ENVIRONMENT BACKGROUND TAILORED TO CATEGORY
    const bgGrad = ctx.createRadialGradient(
      width / 2,
      height * 0.4,
      width * 0.1,
      width / 2,
      height / 2,
      width * 0.95
    );

    if (environmentTheme === 'beauty_studio') {
      bgGrad.addColorStop(0, '#381A32');
      bgGrad.addColorStop(0.5, '#1E0E1E');
      bgGrad.addColorStop(1, '#0A030A');
    } else if (environmentTheme === 'tech_neon') {
      bgGrad.addColorStop(0, '#0E284A');
      bgGrad.addColorStop(0.5, '#07152B');
      bgGrad.addColorStop(1, '#020712');
    } else if (environmentTheme === 'fashion_vibe') {
      bgGrad.addColorStop(0, '#2D1B4E');
      bgGrad.addColorStop(0.5, '#150A26');
      bgGrad.addColorStop(1, '#05020B');
    } else if (environmentTheme === 'home_scandi' || environmentTheme === 'warm_lifestyle') {
      bgGrad.addColorStop(0, '#3E2A1C');
      bgGrad.addColorStop(0.5, '#20130A');
      bgGrad.addColorStop(1, '#0B0502');
    } else if (environmentTheme === 'fitness_raw') {
      bgGrad.addColorStop(0, '#1E3A2F');
      bgGrad.addColorStop(0.5, '#0B1C15');
      bgGrad.addColorStop(1, '#020A06');
    } else {
      bgGrad.addColorStop(0, '#1E243B');
      bgGrad.addColorStop(0.5, '#0D111F');
      bgGrad.addColorStop(1, '#04060C');
    }

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Studio Background bokeh / rim light rings
    for (let i = 0; i < 6; i++) {
      const bX = width * (0.2 + (i % 3) * 0.3);
      const bY = height * (0.2 + Math.floor(i / 3) * 0.35);
      const bR = 60 + (i % 3) * 35;
      const bGrad = ctx.createRadialGradient(bX, bY, 0, bX, bY, bR);
      bGrad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
      bGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bGrad;
      ctx.beginPath();
      ctx.arc(bX, bY, bR, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. PRESENTER POSITIONING & SUBTLE MICRO-ANIMATION
    // Natural breathing + gentle head tilt
    const breatheY = Math.sin(currentTime * 2.2) * 2;
    const tilt = isSpeaking ? Math.sin(currentTime * 3.5) * 0.015 : 0;
    const centerX = width / 2;
    const centerY = height * 0.44 + breatheY;

    ctx.translate(centerX, centerY);
    ctx.rotate(tilt);

    // 3. CLOTHING & TORSO
    const isFemale = presenter.gender === 'Female';
    const isIndian = presenter.demographic === 'Indian';
    const skinTone = isIndian ? '#D49B6A' : '#ECC09A';
    const shadowSkin = isIndian ? '#B87B4C' : '#D0A07A';

    // Clothing Torso
    ctx.fillStyle = presenter.avatarColor;
    ctx.beginPath();
    ctx.ellipse(0, 160, 115, 80, 0, 0, Math.PI * 2);
    ctx.fill();

    // Torso inner garment / blazer lapel
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.moveTo(-45, 100);
    ctx.lineTo(0, 175);
    ctx.lineTo(45, 100);
    ctx.lineTo(30, 200);
    ctx.lineTo(-30, 200);
    ctx.closePath();
    ctx.fill();

    // Collar / Shirt detail
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-35, 105);
    ctx.lineTo(0, 145);
    ctx.lineTo(35, 105);
    ctx.stroke();

    // 4. NECK & JAW SHADOW
    ctx.fillStyle = shadowSkin;
    ctx.beginPath();
    ctx.roundRect(-22, 60, 44, 48, 10);
    ctx.fill();

    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.roundRect(-20, 62, 40, 44, 10);
    ctx.fill();

    // 5. HEAD & FACE STRUCTURE
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.ellipse(0, 15, 62, 74, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 6. CHEEK BLUSH & HIGHLIGHT
    ctx.fillStyle = isFemale ? 'rgba(244, 63, 94, 0.16)' : 'rgba(217, 119, 6, 0.1)';
    ctx.beginPath();
    ctx.ellipse(-34, 25, 16, 10, 0, 0, Math.PI * 2);
    ctx.ellipse(34, 25, 16, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // 7. EYES & NATURAL BLINKING
    // Eye blink every ~4 seconds
    const blinkCycle = currentTime % 4.2;
    const isBlinking = blinkCycle > 3.95 && blinkCycle < 4.12;

    const eyeY = 8;
    const eyeSpacing = 24;

    if (isBlinking) {
      // Closed eyelid arc
      ctx.strokeStyle = '#291810';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(-eyeSpacing, eyeY, 10, 0.2, Math.PI - 0.2);
      ctx.arc(eyeSpacing, eyeY, 10, 0.2, Math.PI - 0.2);
      ctx.stroke();
    } else {
      // Sclera (White)
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(-eyeSpacing, eyeY, 11, 7, 0, 0, Math.PI * 2);
      ctx.ellipse(eyeSpacing, eyeY, 11, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Iris (Dark Amber/Brown)
      ctx.fillStyle = isIndian ? '#3B2219' : '#2D4156';
      ctx.beginPath();
      ctx.arc(-eyeSpacing, eyeY, 5.5, 0, Math.PI * 2);
      ctx.arc(eyeSpacing, eyeY, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Pupil (Jet Black)
      ctx.fillStyle = '#050505';
      ctx.beginPath();
      ctx.arc(-eyeSpacing, eyeY, 2.8, 0, Math.PI * 2);
      ctx.arc(eyeSpacing, eyeY, 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Catchlight specular reflection
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-eyeSpacing - 1.5, eyeY - 1.8, 1.8, 0, Math.PI * 2);
      ctx.arc(eyeSpacing - 1.5, eyeY - 1.8, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Eyebrows
    ctx.strokeStyle = '#24140D';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-eyeSpacing - 13, eyeY - 11);
    ctx.quadraticCurveTo(-eyeSpacing, eyeY - 15, -eyeSpacing + 11, eyeY - 10);
    ctx.moveTo(eyeSpacing - 11, eyeY - 10);
    ctx.quadraticCurveTo(eyeSpacing, eyeY - 15, eyeSpacing + 13, eyeY - 11);
    ctx.stroke();

    // 8. NOSE
    ctx.strokeStyle = shadowSkin;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(2, 28);
    ctx.lineTo(-4, 32);
    ctx.stroke();

    // 9. DYNAMIC LIP-SYNC MOUTH ANIMATION
    const mouthY = 48;
    if (isSpeaking) {
      // Syllable phoneme simulation
      const openAmount = Math.max(
        0.1,
        (Math.sin(currentTime * 16) * 0.45 + 0.5) * (0.6 + Math.cos(currentTime * 9) * 0.4)
      );
      const mouthOpenH = 4 + openAmount * 14;
      const mouthWidth = 20 + Math.sin(currentTime * 12) * 5;

      // Dark oral cavity
      ctx.fillStyle = '#450A0A';
      ctx.beginPath();
      ctx.ellipse(0, mouthY, mouthWidth / 2, mouthOpenH / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Subtle upper teeth visible
      if (openAmount > 0.3) {
        ctx.fillStyle = '#F8FAFC';
        ctx.beginPath();
        ctx.roundRect(-mouthWidth / 3.5, mouthY - mouthOpenH / 2, (mouthWidth / 3.5) * 2, 3.5, 1);
        ctx.fill();
      }

      // Upper and lower lips
      ctx.strokeStyle = isFemale ? '#BE185D' : '#9F583D';
      ctx.lineWidth = 3;
      ctx.beginPath();
      // Upper lip cupid's bow
      ctx.moveTo(-mouthWidth / 2, mouthY);
      ctx.quadraticCurveTo(0, mouthY - mouthOpenH / 2 - 2, mouthWidth / 2, mouthY);
      ctx.stroke();

      // Lower lip
      ctx.beginPath();
      ctx.moveTo(-mouthWidth / 2, mouthY);
      ctx.quadraticCurveTo(0, mouthY + mouthOpenH / 2 + 2, mouthWidth / 2, mouthY);
      ctx.stroke();
    } else {
      // Natural gentle smile
      ctx.strokeStyle = isFemale ? '#BE185D' : '#9F583D';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(-14, mouthY);
      ctx.quadraticCurveTo(0, mouthY + 5.5, 14, mouthY);
      ctx.stroke();
    }

    // 10. HAIR STYLING
    ctx.fillStyle = '#170E08';
    if (presenter.hairStyle === 'long_wavy') {
      // Long flowing hair framing shoulders
      ctx.beginPath();
      ctx.ellipse(0, -25, 68, 55, 0, Math.PI, Math.PI * 2);
      ctx.lineTo(66, 120);
      ctx.quadraticCurveTo(72, 145, 52, 160);
      ctx.quadraticCurveTo(40, 110, 52, 50);
      ctx.lineTo(-52, 50);
      ctx.quadraticCurveTo(-40, 110, -52, 160);
      ctx.quadraticCurveTo(-72, 145, -66, 120);
      ctx.closePath();
      ctx.fill();
    } else if (presenter.hairStyle === 'sleek_bun') {
      // Chic high bun
      ctx.beginPath();
      ctx.ellipse(0, -22, 65, 48, 0, Math.PI, Math.PI * 2);
      ctx.fill();
      // Top bun
      ctx.beginPath();
      ctx.arc(0, -68, 22, 0, Math.PI * 2);
      ctx.fill();
    } else if (presenter.hairStyle === 'chic_bob') {
      // Modern chic bob
      ctx.beginPath();
      ctx.ellipse(0, -22, 66, 52, 0, Math.PI, Math.PI * 2);
      ctx.lineTo(64, 45);
      ctx.quadraticCurveTo(55, 75, 40, 70);
      ctx.lineTo(-40, 70);
      ctx.quadraticCurveTo(-55, 75, -64, 45);
      ctx.closePath();
      ctx.fill();
    } else {
      // Short modern crop / fade
      ctx.beginPath();
      ctx.ellipse(0, -26, 64, 48, 0, Math.PI, Math.PI * 2);
      ctx.lineTo(60, 20);
      ctx.lineTo(54, 30);
      ctx.lineTo(-54, 30);
      ctx.lineTo(-60, 20);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();

    // 11. SPEAKING AUDIO WAVEFORM / GLOWING AURA (When Speaking)
    if (isSpeaking) {
      ctx.save();
      const wavePulse = (Math.sin(currentTime * 10) * 0.5 + 0.5) * 8;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY - 10, 110 + wavePulse, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY - 10, 125 + wavePulse * 1.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 12. PRESENTER IDENTITY BADGE (Lower-Third Presenter Pill)
    ctx.save();
    const badgeY = height * 0.63;
    const badgeW = Math.min(width - 48, 260);
    const badgeX = (width - badgeW) / 2;

    ctx.fillStyle = 'rgba(11, 25, 56, 0.88)';
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, 36, 18);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Green online / speaking indicator dot
    ctx.fillStyle = isSpeaking ? '#10B981' : '#94A3B8';
    ctx.beginPath();
    ctx.arc(badgeX + 20, badgeY + 18, 5, 0, Math.PI * 2);
    ctx.fill();

    // Presenter Name & Role
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${presenter.name} • ${presenter.style}`, badgeX + 34, badgeY + 22);
    ctx.restore();
  }

  /**
   * Renders picture-in-picture floating avatar bubble (for B-roll / demonstration scenes)
   */
  static renderFloatingPipPresenter(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    presenter: AIPresenter,
    isSpeaking: boolean,
    currentTime: number
  ) {
    ctx.save();

    // Outer glow ring
    if (isSpeaking) {
      const pulse = Math.sin(currentTime * 12) * 3 + 4;
      ctx.shadowColor = presenter.avatarColor;
      ctx.shadowBlur = 14 + pulse;
      ctx.strokeStyle = presenter.avatarColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, radius + 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Clip to circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.clip();

    // Background fill
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);

    // Mini Presenter Rendering
    const scale = radius / 75;
    ctx.translate(x, y + 8);
    ctx.scale(scale, scale);

    const isIndian = presenter.demographic === 'Indian';
    const isFemale = presenter.gender === 'Female';
    const skinTone = isIndian ? '#D49B6A' : '#ECC09A';

    // Clothing
    ctx.fillStyle = presenter.avatarColor;
    ctx.beginPath();
    ctx.ellipse(0, 75, 55, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.ellipse(0, 5, 34, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#050505';
    ctx.beginPath();
    ctx.arc(-12, 0, 3, 0, Math.PI * 2);
    ctx.arc(12, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    // Mouth
    if (isSpeaking) {
      const mouthH = 3 + (Math.sin(currentTime * 15) * 0.5 + 0.5) * 8;
      ctx.fillStyle = isFemale ? '#BE185D' : '#881337';
      ctx.beginPath();
      ctx.ellipse(0, 22, 8, mouthH / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = isFemale ? '#BE185D' : '#9F583D';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 18, 7, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }

    // Hair
    ctx.fillStyle = '#170E08';
    ctx.beginPath();
    ctx.ellipse(0, -15, 36, 26, 0, Math.PI, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Mini Live Mic Icon
    ctx.save();
    ctx.fillStyle = isSpeaking ? '#EF4444' : '#64748B';
    ctx.beginPath();
    ctx.arc(x + radius * 0.7, y + radius * 0.7, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AI', x + radius * 0.7, y + radius * 0.7 + 3);
    ctx.restore();
  }
}
