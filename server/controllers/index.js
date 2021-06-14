const fetch = require('node-fetch');
const HttpStatus = require('http-status-codes')

exports.getItems = (req, res) => {
    token = JSON.parse(req.headers.token ? req.headers.token : null)
   
    if (token && token.name === "b2xpdmVyaW8=" && token.lastname === "cGV0cmVjY2E=") {
        let name = Buffer.from(token.name, 'base64').toString('ascii');
        let lastname = Buffer.from(token.lastname, 'base64').toString('ascii')
        const { q } = req.query;
        const uri = `https://api.mercadolibre.com/sites/MLA/search?q=​:${q}`;
        const encoded = encodeURI(uri);
        (async () => {
            const response = await fetch(encoded);
            if (response.ok) {
                const json = await response.json();
                const firstFour = json.results.slice(0, 4)
                meliCategories = json.available_filters[0] ? json.available_filters[0].values : []
                let categories = [];
                meliCategories.length > 0 && meliCategories.map(x => {
                    firstFour.map(f => {
                        f.category_id == x.id ? categories.push(x.name) : null
                    })
                })

                const publi = {
                    author: {
                        name: name,
                        lastname: lastname
                    },
                    categories: categories.length > 0 ? categories : [capitalize(q)],
                    items: firstFour.map(f => {
                        return (
                            {
                                id: f.id,
                                title: f.title,
                                price: {
                                    currency: f.currency_id,
                                    amount: f.price,
                                    decimals: Number.parseFloat(f.price).toFixed(2),
                                },
                                picture: f.thumbnail,
                                condition: f.condition,
                                free_shipping: f.shipping.free_shipping,
                                address: f.address.state_name
                            }
                        )
                    })
                }
                res.status(HttpStatus.StatusCodes.OK).json(publi);
            } else {
                res.status(HttpStatus.StatusCodes.BAD_REQUEST).json(response.statusText);
            }
        })();

    } else {
        res.status(HttpStatus.StatusCodes.OK).json("firma no enviada o incorrecta");
    }
};


capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


exports.getById = (req, res) => {
    token = JSON.parse(req.headers.token ? req.headers.token : null)
  
    if (token && token.name === "b2xpdmVyaW8=" && token.lastname === "cGV0cmVjY2E=") {
        let name =  Buffer.from(token.name, 'base64').toString('ascii')
        let lastname =  Buffer.from(token.lastname, 'base64').toString('ascii')
        let id = req.params.id
        const uriId = `https://api.mercadolibre.com/items/${id}`;
        (async () => {
            const responseId = await fetch(uriId);
            if (responseId.ok) {
                const json = await responseId.json();
                const uriDescription = `https://api.mercadolibre.com/items/${id}/description`;
                const responseDescription = await fetch(uriDescription);
                const jsonDescription = await responseDescription.json();
                publi = {
                    author: {
                        name: "oliverio",
                        lastname: "petrecca"
                    },
                    item: {
                        id: json.id,
                        title: json.title,
                        price: {
                            currency: json.currency_id,
                            amount: Math.trunc(json.price),
                            decimals: Number.parseFloat(json.price.toFixed(2).split(".")[1]),
                        },
                        picture: json.pictures[0].url,
                        condition: json.condition,
                        free_shipping: json.shipping.free_shipping,
                        sold_quantity: json.sold_quantity,
                        description: jsonDescription.plain_text ? jsonDescription.plain_text : "sin descripcion"
                    }
                }

                res.status(HttpStatus.StatusCodes.OK).json(publi);
            } else {
                res.status(HttpStatus.StatusCodes.BAD_REQUEST).json(responseId.statusText);
            }
        })();
    } else {
        res.status(HttpStatus.StatusCodes.OK).json("firma no enviada o incorrecta");
    }
};



