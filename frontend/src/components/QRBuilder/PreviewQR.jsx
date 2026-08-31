import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { useQRDesignStore } from '../../stores/useQRDesignStore';
import Button from '../UI/Button';

const PreviewQR = () => {
  const { type, contentData, design } = useQRDesignStore();
  const ref = useRef(null);
  const qrCodeRef = useRef(null);
  const [isRendered, setIsRendered] = useState(false);

  const getPreviewDesign = () => {
    let qrData = 'https://ejemplo.com'; // Default fallback
    
    if (type === 'URL') {
      qrData = contentData.url || 'https://ejemplo.com';
    } else if (type === 'TEXT') {
      qrData = contentData.text || 'Escribe tu mensaje';
    } else if (type === 'EMAIL') {
      const email = contentData.email || 'correo@ejemplo.com';
      const subject = contentData.subject || '';
      const msg = contentData.message || '';
      qrData = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`;
    } else if (type === 'VCARD') {
      const fn = contentData.firstName || 'Nombre';
      const ln = contentData.lastName || 'Apellido';
      const ph = contentData.phone || '';
      const em = contentData.vcardEmail || '';
      const org = contentData.company || '';
      const title = contentData.job || '';
      qrData = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${ln};${fn};;;`,
        `FN:${fn} ${ln}`,
        `ORG:${org}`,
        `TITLE:${title}`,
        `TEL;TYPE=WORK,VOICE:${ph}`,
        `EMAIL:${em}`,
        'END:VCARD'
      ].join('\n');
    } else if (type === 'WIFI') {
      const ssid = contentData.ssid || 'Nombre_Red';
      const pass = contentData.password || '';
      const hidden = contentData.hidden ? 'true' : 'false';
      qrData = `WIFI:S:${ssid};T:WPA;P:${pass};H:${hidden};;`;
    }

    return {
      ...design,
      data: qrData
    };
  };

  useEffect(() => {
    // Inicializar qr-code-styling
    qrCodeRef.current = new QRCodeStyling(getPreviewDesign());
    if (ref.current) {
      ref.current.innerHTML = '';
      qrCodeRef.current.append(ref.current);
      setIsRendered(true);
    }
  }, []);

  useEffect(() => {
    // Actualizar cuando cambie el diseño o el contenido (si es estático)
    if (qrCodeRef.current && isRendered) {
      qrCodeRef.current.update(getPreviewDesign());
    }
  }, [design, type, contentData, isRendered]);

  const onDownload = (ext) => {
    const dlDesign = {
      ...getPreviewDesign(),
      width: 1024,
      height: 1024
    };
    const dlInstance = new QRCodeStyling(dlDesign);
    dlInstance.download({ extension: ext, name: 'QR-Design' });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div 
        className="card flex items-center justify-center mb-6"
        style={{ padding: '2rem', marginBottom: '1.5rem' }}
      >
        <div ref={ref} />
      </div>
      
      <div className="flex gap-4" style={{ display: 'flex', gap: '1rem' }}>
        <Button onClick={() => onDownload('png')}>PNG</Button>
        <Button onClick={() => onDownload('svg')} variant="secondary">SVG</Button>
      </div>
    </div>
  );
};

export default PreviewQR;
