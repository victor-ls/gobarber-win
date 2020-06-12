import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
    static init(sequelize) {
        super.init(
            {
                // OBJETO CONTENDO TODAS AS COLUNAS QUE O USUARIO PODE RECEBER NA HORA DE CRIAR, EDITAR, ETC
                date: Sequelize.DATE,
                canceled_at: Sequelize.DATE,
            },

            {
                sequelize,
            }
        );
        // RETORNA O MÓDULO INICIALIZADO
        return this;
    }

    // associa appointment com a tabela usuário, campos user_id e provider_id
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(models.User, {
            foreignKey: 'provider_id',
            as: 'provider',
        });
    }
}

export default Appointment;
