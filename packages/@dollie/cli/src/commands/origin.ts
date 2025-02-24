import commander from 'commander';
import _ from 'lodash';
import {
  CLIConfigSchema,
} from '../utils/config';
import Table from 'cli-table3';
import {
  OriginConfigSchema,
  registerOrigin,
  deleteRegisteredOrigin,
  switchSelectedOrigin,
} from '../utils/origins';

export default (config: CLIConfigSchema, originConfig: OriginConfigSchema) => {
  const command = new commander.Command('origin');

  command.description('manage template origins');

  command
    .command('add')
    .alias('register')
    .description('add a template origins')
    .arguments('[name] [pathname]')
    .action((name: string, pathname: string) => {
      if (name === 'default') {
        return;
      }
      registerOrigin(name, pathname);
    });

  command
    .command('delete')
    .description('delete a template origin from origins')
    .arguments('[name]')
    .action((name: string) => {
      deleteRegisteredOrigin(name);
    });

  command
    .command('list')
    .description('list all registered origins')
    .action(() => {
      const internalOrigins = {
        github: '<internal>',
        gitlab: '<internal>',
      } as Record<string, string>;
      const { origins: customOrigins = {} } = originConfig;

      const table = new Table({
        head: ['ID', 'Source'],
      });

      const origins = _.merge(internalOrigins, customOrigins);

      for (const originName of Object.keys(origins)) {
        table.push([originName, origins[originName] || '<unknown>']);
      }

      console.log(table.toString());
    });

  command
    .command('use')
    .description('select and use an appropriate origin handler')
    .arguments('[id]')
    .action((id: string) => {
      switchSelectedOrigin(id);
    });

  return command;
};
