import Sequelize, { Model } from 'sequelize';

class File extends Model {
    static init(sequelize) {
        super.init(
            {
                // OBJETO CONTENDO TODAS AS COLUNAS QUE O USUARIO PODE RECEBER NA HORA DE CRIAR, EDITAR, ETC
                name: Sequelize.STRING,
                path: Sequelize.STRING,
                url: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return `http://localhost:3333/files/${this.path}`;
                    },
                },
            },
            {
                sequelize,
            }
        );
        // RETORNA O MÓDULO INICIALIZADO
        return this;
    }
}

export default File;
