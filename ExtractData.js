//Imports
const axios = require("axios");
const cheerio = require('cheerio');

axios
  .get('https://prefeitura.pbh.gov.br/saude/licitacao/pregao-eletronico-151-2020')
  .then((response) => {

    const html = response.data;
	const $ = cheerio.load(html);

	const blocks = $('#block-views-block-view-noticia-pbh-block-5 .item').find('.views-field');
	const metadataBlock = $(blocks[1]);
	const tableBlock = $(blocks[2]);
	const fields = metadataBlock.find('.lbl-licitacao');
	const publicationDate = $(fields[0]).text().replace("DATA DA PUBLICAÇÃO: ", '');
	const biddingDate = $(fields[5]).text().replace('DATA DA LICITAÇÃO: ', '');
	const object = metadataBlock.find('span > p:nth-child(6)').text();

	const links = [];
	const tableRows = tableBlock.find('tbody a').toArray();
	tableRows.forEach((row) => {
	const link = $(row).attr('href');
	let REGEX = '((http|https)://)(www.)?'
              + '[a-zA-Z0-9@:%._\\+~#?&//=]'
              + '{2,256}\\.[a-z]'
              + '{2,6}\\b([-a-zA-Z0-9@:%'
              + '._\\+~#?&//=]*)';
	if (new RegExp(REGEX).test(link)) {
	  links.push(link);
	}
	});
	console.log('Extracted Data:');
	console.log(`Publication Date: ${publicationDate}\nBidding Date: ${biddingDate}\nObject: ${object}\nLinks: ${links.join('\n')}`);
})
