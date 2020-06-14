import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [CancellationMail];

class Queue {
    constructor() {
        this.queues = {};

        this.init();
    }

    // armazena todos os jobs dentro de this.queues
    init() {
        jobs.forEach(({ key, handle }) => {
            this.queues[key] = {
                bee: new Bee(key, {
                    redis: redisConfig,
                }),
                handle,
            };
        });
    }

    // adiciona jobs nas filas
    add(queue, job) {
        return this.queues[queue].bee.createJob(job).save();
    }

    // processa as filas. quando adicionar qualquer job, processQueue entra em ação e processa o job em background

    processQueue() {
        jobs.forEach((job) => {
            const { bee, handle } = this.queues[job.key];

            bee.on('failed', this.handleFailure).process(handle);
        });
    }

    handleFailure(job, err) {
        console.log(`Queue ${job.queue.name}: FAILED`, err);
    }
}

export default new Queue();
