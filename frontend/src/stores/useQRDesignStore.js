import { create } from 'zustand';

const defaultDesign = {
  width: 300,
  height: 300,
  data: 'https://ejemplo.com', // Default placeholder
  dotsOptions: {
    color: '#000000',
    type: 'rounded'
  },
  backgroundOptions: {
    color: '#ffffff'
  },
  cornersSquareOptions: {
    color: '#000000',
    type: 'extra-rounded'
  },
  cornersDotOptions: {
    color: '#000000',
    type: 'dot'
  },
  imageOptions: {
    crossOrigin: 'anonymous',
    margin: 10,
    imageSize: 0.4
  },
  image: null
};

export const useQRDesignStore = create((set) => ({
  // Content State
  type: 'URL',
  isDynamic: false,
  contentData: { url: '' },
  
  // Design State
  design: { ...defaultDesign },
  
  // Actions - Content
  setType: (type) => set({ type, contentData: {}, isDynamic: false }),
  setIsDynamic: (isDynamic) => set({ isDynamic }),
  setContentData: (data) => set((state) => ({ contentData: { ...state.contentData, ...data } })),
  
  // Actions - Design
  updateDesign: (key, value) => set((state) => ({
    design: { ...state.design, [key]: value }
  })),
  
  updateNestedDesign: (parent, key, value) => set((state) => ({
    design: {
      ...state.design,
      [parent]: {
        ...state.design[parent],
        [key]: value
      }
    }
  })),
  
  resetDesign: () => set({ design: { ...defaultDesign } })
}));
