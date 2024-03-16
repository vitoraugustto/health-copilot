import { ReactMicStopEvent } from 'react-mic';

declare module 'react-mic' {
  export interface ReactMicStopEvent {
    options: ReactMicStopEvent['option'];
  }
}
