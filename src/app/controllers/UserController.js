import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class UserController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        });

        // verifica se o req.body bate com as especificações criadas
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const userExists = await User.findOne({
            where: { email: req.body.email },
        });

        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // PEGA APENAS ALGUMAS INFORMAÇÕES DO USUÁRIO QUE É PASSADO, POR MEIO DO DESTRUCTURING
        const { id, name, email, provider } = await User.create(req.body);
        return res.json({
            id,
            name,
            email,
            provider,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string()
                .min(6)
                .when('oldPassword', (oldPassword, field) =>
                    oldPassword ? field.required() : field
                ),
            confirmPassword: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
        });

        // verifica se o req.body bate com as especificações criadas
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { email, oldPassword } = req.body;

        const user = await User.findByPk(req.userId);

        // email cadastrado é diferente do que está sendo passado?
        if (email && email !== user.email) {
            const userExists = await User.findOne({
                where: { email },
            });

            if (userExists) {
                return res.status(400).json({ error: 'User already exists' });
            }
        }

        // senha antiga realmente bate com a que está no banco?
        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ error: 'Password does not match' });
        }

        // passa apenas algumas informações para o front
        await user.update(req.body);

        const { id, name, avatar } = await User.findByPk(req.userId, {
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['id', 'path', 'url'],
                },
            ],
        });

        return res.json({
            id,
            name,
            email,
            avatar,
        });
    }
}

export default new UserController();
