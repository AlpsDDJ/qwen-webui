const svgs = {
    IosSend: ['M435.9,64.9L68.8,224.9c-6.5,3.1-6.3,12.4,0.3,15.3l99.3,56.1c5.9,3.3,13.2,2.6,18.3-1.8l195.8-168.8c1.3-1.1,4.4-3.2,5.6-2c1.3,1.3-0.7,4.3-1.8,5.6L216.9,320.1c-4.7,5.3-5.4,13.1-1.6,19.1l64.9,104.1c3.2,6.3,12.3,6.2,15.2-0.2L447.2,76C450.5,68.8,443,61.5,435.9,64.9z'],
    IosMic: [
        'M256,336L256,336c35.2,0,64-28.8,64-64V112c0-35.2-28.8-64-64-64h0c-35.2,0-64,28.8-64,64v160C192,307.2,220.8,336,256,336z',
        'M352,192c-7.7,0-14,6.3-14,14v69c0,45.2-36.8,82-82,82s-82-36.8-82-82v-69c0-7.7-6.3-14-14-14s-14,6.3-14,14v69c0,55.9,41.9,102.2,96,109.1V436h-36c-7.7,0-14,6.3-14,14s6.3,14,14,14h100c7.7,0,14-6.3,14-14s-6.3-14-14-14h-36v-51.9c54.1-6.9,96-53.2,96-109.1v-69C366,198.3,359.7,192,352,192z'
    ],
    IosMicOff: [
        'M369.8,464c-4.9,0-9.7-2.5-12.3-7L129.9,69.3c-4-6.7-1.7-15.4,5.1-19.3c6.8-3.9,15.5-1.7,19.5,5.1l227.6,387.7c4,6.7,1.7,15.4-5.1,19.3C374.7,463.4,372.2,464,369.8,464z',
        'M320,272V112c0-35.2-28.8-64-64-64h0c-28.4,0-52.6,18.8-60.9,44.5L315,296.8C318.2,289.2,320,280.8,320,272z',
        'M192,272c0,35.2,28.8,64,64,64h0c3.9,0,7.6-0.4,11.3-1L192,206.6V272z',
        'M366,275v-69c0-7.7-6.3-14-14-14s-14,6.3-14,14v69c0,15.2-4.2,29.4-11.4,41.6l15.6,26.6C357.1,324.5,366,300.8,366,275z',
        'M256,357c-45.2,0-82-36.8-82-82v-69c0-7.7-6.3-14-14-14s-14,6.3-14,14v69c0,55.9,41.9,102.2,96,109.1V436h-36c-7.7,0-14,6.3-14,14s6.3,14,14,14h100c7.7,0,14-6.3,14-14s-6.3-14-14-14h-36v-51.9c7.9-1,15.6-2.9,22.9-5.5l-14.5-24.8C271.3,355.9,263.8,357,256,357z',
    ],
    MdPerson: [
        'M256,256c52.805,0,96-43.201,96-96s-43.195-96-96-96s-96,43.201-96,96S203.195,256,256,256z M256,304c-63.598,0-192,32.402-192,96v48h384v-48C448,336.402,319.598,304,256,304z',
    ],
    Robot: [
        'M380.91 199l42.47-73.57a8.63 8.63 0 0 0-3.12-11.76a8.52 8.52 0 0 0-11.71 3.12l-43 74.52c-32.83-15-69.78-23.35-109.52-23.35s-76.69 8.36-109.52 23.35l-43-74.52a8.6 8.6 0 1 0-14.88 8.64L131 199C57.8 238.64 8.19 312.77 0 399.55h512c-8.19-86.78-57.8-160.91-131.09-200.55zM138.45 327.65a21.46 21.46 0 1 1 21.46-21.46a21.47 21.47 0 0 1-21.46 21.46zm235 0A21.46 21.46 0 1 1 395 306.19a21.47 21.47 0 0 1-21.51 21.46z'
    ],
    IosRepeat: [
        'M336.6,157.5l-33.6-33.4c-3.5-3.5-8.5-4.9-13.6-3.6c-1.2,0.3-2.4,0.8-3.5,1.5c-4.7,2.9-7.2,7.8-6.8,13.1c0.2,3.4,1.9,6.6,4.3,9.1l16,15.9H142c-20.8,0-40.3,8.1-55.1,22.9C72.1,197.7,64,217.2,64,238v16c0,7.7,6.3,14,14,14l0,0c7.7,0,14-6.3,14-14v-16c0-13.3,5.2-25.8,14.7-35.3c9.5-9.5,22-14.7,35.3-14.7h155.4l-16,15.9c-2.4,2.4-4,5.4-4.3,8.7c-0.4,4.2,1.1,8.3,4.1,11.3c2.6,2.6,6.2,4.1,9.9,4.1c3.7,0,7.2-1.4,9.9-4.1l35.6-35.4c4.2-4.1,6.5-9.7,6.5-15.5C343,167.1,340.7,161.6,336.6,157.5z',
        'M434,244L434,244c-7.7,0-14,6.3-14,14v16c0,13.3-5.2,25.8-14.7,35.3c-9.5,9.5-22,14.7-35.3,14.7H214.6l16-15.9c2.4-2.4,4-5.4,4.3-8.8c0.4-4.2-1.1-8.3-4.1-11.3c-2.6-2.6-6.2-4.1-9.9-4.1c-3.7,0-7.2,1.4-9.9,4.1l-35.6,35.4c-4.2,4.1-6.5,9.7-6.5,15.5c0,5.9,2.3,11.4,6.5,15.5l33.6,33.4c3.5,3.5,8.5,4.9,13.6,3.6c1.2-0.3,2.4-0.8,3.5-1.5c4.7-2.9,7.2-7.8,6.8-13.1c-0.2-3.4-1.9-6.6-4.3-9.1l-16-15.9H370c43,0,78-35,78-78v-16C448,250.3,441.7,244,434,244z'
    ],
    MdSettings: ['M413.967,276.8c1.06-6.235,1.06-13.518,1.06-20.8s-1.06-13.518-1.06-20.8l44.667-34.318c4.26-3.118,5.319-8.317,2.13-13.518L418.215,115.6c-2.129-4.164-8.507-6.235-12.767-4.164l-53.186,20.801c-10.638-8.318-23.394-15.601-36.16-20.801l-7.448-55.117c-1.06-4.154-5.319-8.318-10.638-8.318h-85.098c-5.318,0-9.577,4.164-10.637,8.318l-8.508,55.117c-12.767,5.2-24.464,12.482-36.171,20.801l-53.186-20.801c-5.319-2.071-10.638,0-12.767,4.164l-42.549,71.765c-2.119,4.153-1.061,10.399,2.129,13.518L96.97,235.2c0,7.282-1.06,13.518-1.06,20.8s1.06,13.518,1.06,20.8l-44.668,34.318c-4.26,3.118-5.318,8.317-2.13,13.518L92.721,396.4c2.13,4.164,8.508,6.235,12.767,4.164l53.187-20.801c10.637,8.318,23.394,15.601,36.16,20.801l8.508,55.117c1.069,5.2,5.318,8.318,10.637,8.318h85.098c5.319,0,9.578-4.164,10.638-8.318l8.518-55.117c12.757-5.2,24.464-12.482,36.16-20.801l53.187,20.801c5.318,2.071,10.637,0,12.767-4.164l42.549-71.765c2.129-4.153,1.06-10.399-2.13-13.518L413.967,276.8zM255.468,328.8c-41.489,0-74.46-32.235-74.46-72.8s32.971-72.8,74.46-72.8s74.461,32.235,74.461,72.8S296.957,328.8,255.468,328.8z'],
    Eraser24Regular: ['M15.87 2.669l4.969 4.968a2.25 2.25 0 0 1 0 3.182l-8.682 8.68l6.098.001a.75.75 0 0 1 .743.648l.007.102a.75.75 0 0 1-.649.743l-.101.007l-8.41.001a2.244 2.244 0 0 1-1.715-.655l-4.968-4.969a2.25 2.25 0 0 1 0-3.182l9.526-9.526a2.25 2.25 0 0 1 3.182 0zM5.709 11.768l-1.487 1.488a.75.75 0 0 0 0 1.06l4.969 4.969c.146.146.338.22.53.22l.03-.005l.038.002a.747.747 0 0 0 .463-.217l1.486-1.487l-6.03-6.03zm8.04-8.039l-6.98 6.978l6.03 6.03l6.979-6.978a.75.75 0 0 0 0-1.061l-4.969-4.969a.75.75 0 0 0-1.06 0z'],
    KeyboardAltRound: ['M21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7 12v2H5v-2h2zm-2-2V8h2v2H5zm6 2v2H9v-2h2zm-2-2V8h2v2H9zm7 6.5c0 .28-.22.5-.5.5h-7c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h7c.28 0 .5.22.5.5zM15 12v2h-2v-2h2zm-2-2V8h2v2h-2zm4 4v-2h2v2h-2zm2-4h-2V8h2v2z']
}
export type SvgNames = keyof typeof svgs

export const getSvg = (name: string): string[] => {
    return (typeof svgs[name] === 'string' ? [svgs[name]] : svgs[name]) as string[]
}
