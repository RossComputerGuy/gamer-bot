const Discord = require('discord.js');

class CoreModule {
  constructor(core, options) {
    this.core = core;
    this.options = options;
  }
  metadata() {
    return {
      name: 'Gamer Core',
      desc: 'Core module that provides basic functionality to the Gamer Bot.',
      author: 'Spaceboy Ross',
      ver: '0.1.0',
      url: 'https://github.com/SpaceboyRoss01/gamer-bot',
      provides: [
        'slimbot.js/embed'
      ]
    };
  }
  async init() {
    /* For rich embeds */
    this.core.instance('slimcord.js/embed', (opts) => {
      opts = Object.assign({
        type: 'default',
        message: '',
        description: '',
        color: '#ffffff',
        title: '',
        footer: ''
      }, opts);
      let embed = new Discord.RichEmbed();
      if (typeof opts.author == 'string') {
        embed.setAuthor(opts.author);
      }
      embed.setColor(this.core.config('embeds.' + opts.type + '.color', opts.color));
      embed.setDescription(Array.isArray(opts.message || opts.description) ? (opts.message || opts.description).join('\n') : (opts.message || opts.description));
      embed.setFooter(this.core.config('embeds.' + opts.type + '.footer', opts.footer));
      embed.setTitle(this.core.config('embeds.' + opts.type + '.title', opts.title));
      if (typeof opts.url == 'string') {
        embed.setURL(opts.url);
      }
      return embed;
    });
  }
  start() {
    /* Basic commands */
    this.core.registerCommand('help', {
      description: 'Lists the commands',
      usage: 'help',
      run: (args, message, channel) => {
        channel.send({embed: this.core.make('slimcord.js/embed', {
          title: 'CC Help',
          footer: `Running Gamer Bot version ${require('../package.json').version}. Command prefix is ${this.core.config('prefix')}.`,
          url: require('../package.json').homepage,
          description: Object.keys(this.core.commands).map(commandName => {
            let cmd = this.core.commands[commandName];
            return [
              this.core.config('prefix') + commandName + ' - ' + cmd.description
            ].join('\n');
          })
        })}).catch(err => {
          if (this.core.config('enableLogging')) this.core.logger.error(err);
        });
      }
    });
    
    this.core.registerCommand('list-modules', {
      description: 'Lists the modules installed',
      usage: 'list-modules',
      run: (args, message, channel) => {
        channel.send({embed: this.core.make('slimcord.js/embed', {
          title: 'Installed modules',
          footer: `Running Gamer Bot version ${require('../package.json').version}. Total module count is ${this.core.getModuleNames().length}.`,
          url: require('../package.json').homepage,
          description: this.core.getModuleNames().map(moduleName => {
            let metadata = this.core.getModuleMetadata(moduleName);
            return [
              '* ' + moduleName + ' - ' + metadata.desc
            ].join('\n');
          })
        })}).catch(err => {
          if (this.core.config('enableLogging')) this.core.logger.error(err);
        });
      }
    });
  }
  destroy() {
    delete this.core.commands['help'];
    delete this.core.commands['list-modules'];
  }
}
module.exports = {CoreModule};

// vim:set ts=2 sw=2 et:
