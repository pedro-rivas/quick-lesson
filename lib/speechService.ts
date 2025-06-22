// speechService.ts
type ElevenResponse = {
    audio_url: string;
    // …or whatever shape the API returns
};

interface Task<T> {
    run: () => Promise<T>;
    resolve: (value: T) => void;
    reject: (err: any) => void;
}

export class SpeechService {
    private apiKey: string;
    private concurrency: number;
    private activeCount = 0;
    private queue: Task<ElevenResponse>[] = [];

    constructor(apiKey: string, concurrency = 3) {
        this.apiKey = apiKey;
        this.concurrency = concurrency;
    }

    /** 
     * Enqueue a text-to-speech request.
     * Returns a promise that resolves once the fetch is done.
     */
    speak(text: string): Promise<ElevenResponse> {
        return new Promise<ElevenResponse>((resolve, reject) => {
            const task: Task<ElevenResponse> = {
                run: () => this.doFetch(text),
                resolve,
                reject,
            };
            this.queue.push(task);
            this.tryNext();
        });
    }

    /** Internal: kick off next queued task if we’re under the limit */
    private tryNext() {
        if (this.activeCount >= this.concurrency) return;
        const nextTask = this.queue.shift();
        if (!nextTask) return;

        this.activeCount++;
        nextTask
            .run()
            .then(result => nextTask.resolve(result))
            .catch(err => nextTask.reject(err))
            .finally(() => {
                this.activeCount--;
                this.tryNext();
            });
    }

    /** Internal: the actual fetch call */
    private async doFetch(text: string): Promise<ElevenResponse> {
        const response = await fetch(
            "https://api.elevenlabs.io/v1/text-to-speech/TX3LPaxmHKxFdv7VOQHJ?output_format=mp3_44100_128",
            {
                method: "POST",
                headers: {
                    "Xi-Api-Key": this.apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`ElevenLabs error ${response.status}: ${errText}`);
        }

        const blob = await response.blob();
        const base64 = await this.blobToBase64(blob);
        return { audio_url: base64 };
    }

    /** Convert a Blob into a Base64 string (drops the "data:…;base64," prefix) */
    private blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;        // "data:audio/mpeg;base64,AAAA…"
                const base64 = dataUrl.split(",")[1];           // strip off the prefix
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
}
