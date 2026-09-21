export default async function handler(req, res) {
    try {

        const response = await fetch(
            "https://gamemonetize.com/feed.php?format=0",
            {
                method: "GET",
                headers: {
                    "User-Agent": "Mozilla/5.0"
                },
                cache: "no-store"
            }
        );

        if (!response.ok) {

            return res.status(response.status).json({
                error:
                    "GameMonetize returned HTTP " +
                    response.status
            });
        }

        const text =
            await response.text();

        let data;

        try {

            data = JSON.parse(text);

        } catch (error) {

            console.error(
                "Invalid JSON from GameMonetize:",
                text.substring(0, 500)
            );

            return res.status(502).json({
                error:
                    "GameMonetize returned invalid JSON"
            });
        }

        if (!Array.isArray(data)) {

            return res.status(502).json({
                error:
                    "GameMonetize response is not an array"
            });
        }

        res.setHeader(
            "Content-Type",
            "application/json; charset=utf-8"
        );

        res.setHeader(
            "Cache-Control",
            "s-maxage=300, stale-while-revalidate=600"
        );

        return res.status(200).json(data);

    } catch (error) {

        console.error(
            "GameMonetize API error:",
            error
        );

        return res.status(500).json({
            error:
                "Failed to fetch GameMonetize feed"
        });
    }
}
