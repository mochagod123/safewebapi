const { Client, GatewayIntentBits, Partials, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const tmp = require('tmp');
const { createCanvas, loadImage, registerFont } = require('canvas');
const Keyv = require('keyv')
const fetch = require("node-fetch");
const { Agent } = require('undici');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('safeweb')
		.setDescription('Webの安全性を確認します。')
        .addStringOption(
            option => option
            .setName("url")
            .setDescription("URLを入力して")
            .setRequired(true)
        ),

	async execute(interaction) {
        try {
            await interaction.deferReply();

            const url = `https://safeweb.norton.com/safeweb/sites/v1/details?url=${interaction.options.getString("url")}&insert=0`;

            const res = await fetch(url, {
                dispatcher: new Agent({
                  keepAliveTimeout: 10,
                  keepAliveMaxTimeout: 10
                })
            })
        
            const json = await res.json();

            const urla = `https://safeweb.norton.com/safeweb/sites/v1/${json.id}/reviews?sortType=1&pageNo=1&pageSize=2`;

            const resa = await fetch(urla, {
                dispatcher: new Agent({
                  keepAliveTimeout: 10,
                  keepAliveMaxTimeout: 10
                })
            })

            const jsona = await resa.json();

            if (json.communityRating <= 2.0)
            {
                await interaction.editReply(`コメント: ${jsona.reviews[1].title}\nレビュー: ${json.communityRating}\nこのサイトは危険です。`);
            } else {
                await interaction.editReply(`コメント: ${jsona.reviews[1].title}\nレビュー: ${json.communityRating}\nこのサイトは安全です。`);
            }
            
        } catch (e) {
            await interaction.editReply(`エラーが発生しました。`);
        }
	},
};