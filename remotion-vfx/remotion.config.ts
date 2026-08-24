import { Config } from '@remotion/cli/config';

// Remotion rendering optimization configurations
Config.setCodec('h264');
Config.setVideoImageFormat('jpeg'); // JPEG is faster than PNG for intermediate render frames
Config.setConcurrency(8);
Config.setJpegQuality(80);
Config.setPixelFormat('yuv420p');
