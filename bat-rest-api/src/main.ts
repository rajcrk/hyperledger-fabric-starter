import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { config as awsConfig } from 'aws-sdk';
import * as bodyParser from 'body-parser';
import { ApplicationModule } from './app.module';
import { EnvConfig } from './common/config/env';
import { Log } from './common/utils/logging/log.service';
import * as cors from 'cors';
import { RolesGuard } from './user/guard/roles.guard';

/**
 * Set AWS Credentials
 */

awsConfig.update({
    accessKeyId: EnvConfig.AWS_ACCESS_KEY,
    secretAccessKey: EnvConfig.AWS_SECRET_ACCESS_KEY,
    region: EnvConfig.AWS_REGION
});

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);

    app.use(bodyParser.json());

    app.useGlobalPipes(new ValidationPipe());

    /**
     * Headers setup
     */
    app.use(cors());
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        next();
    });

    /**
     * Swagger implementation
     */
    let options = new DocumentBuilder()
        .setTitle('Zilker Asset Blockchain API')
        .setDescription('Zilker Asset Management API')
        .setVersion('1.0')
        .addBearerAuth();

    let swaggerOptions: SwaggerCustomOptions = {};

    if (EnvConfig.AUTH0_DOMAIN) {
        options = options.addOAuth2('implicit', `https://${EnvConfig.AUTH0_DOMAIN}/authorize`, `https://${EnvConfig.AUTH0_DOMAIN}/oauth/token`);

        swaggerOptions = {
            swaggerOptions: {
                oauth2RedirectUrl: `${EnvConfig.DOMAIN_URL}/api/oauth2-redirect.html`,
                oauth: {
                    clientId: EnvConfig.AUTH0_CLIENT_ID,
                    appName: 'Zilker Asset API',
                    scopeSeparator: ' ',
                    additionalQueryStringParams: { audience: EnvConfig.AUTH0_AUDIENCE }
                }
            }
        };
    }

    const document = SwaggerModule.createDocument(app, options.build());

    SwaggerModule.setup('/api', app, document, {
        swaggerOptions
    });

    /**
     * Start Chainservice API
     */
    await app.listen(+EnvConfig.PORT, () => {
        Log.config.info(`Started Chain-service on PORT ${EnvConfig.PORT}`);
    });

}

bootstrap();