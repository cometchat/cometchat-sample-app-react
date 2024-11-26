import { DataSource } from '../../utils/DataSource';
import { CallingExtensionDecorator } from './CallingExtensionDecorator';
import { ChatConfigurator } from '../../utils/ChatConfigurator';
import { ExtensionsDataSource } from '../Extensions/ExtensionsDataSource';
import { CallingConfiguration } from './CallingConfiguration';

export class CallingExtension extends ExtensionsDataSource {
    private configuration?: CallingConfiguration;
    constructor(configuration?: CallingConfiguration) {
        super();
        this.configuration = configuration;
    }
    enable(): void {
        ChatConfigurator.enable((dataSource: DataSource) =>
            new CallingExtensionDecorator(dataSource, this.configuration)
        );
    }

    override addExtension(): void {
        ChatConfigurator.enable((dataSource: any, configuration?: CallingConfiguration) => new CallingExtensionDecorator(dataSource, configuration));
    }

    override getExtensionId(): string {
        return "calling";
    }
}
