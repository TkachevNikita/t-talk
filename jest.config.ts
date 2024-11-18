import { getJestProjectsAsync } from '@nx/jest';
import { ReadableStream } from 'node:stream/web';

export default async () => ({
  projects: await getJestProjectsAsync(),
  globals: {
    ReadableStream: ReadableStream,
  },
});
