<script lang="ts">
    
    // carbon-ui imports
    import { 
        Header,
        Button,
        Content,
        Grid,
        Row,
        Column,
        CodeSnippet
    } from "carbon-components-svelte";

    // module imports
    import {
        adjectives,
        animals,
        uniqueNamesGenerator
    } from "unique-names-generator";

    // create a new room and switch to it
    const createNewRoom = (): void => {
        const roomid = uniqueNamesGenerator({
             dictionaries: [adjectives, animals],
            separator: "-",
            length: 2,
            style: "lowerCase"
        });

        window.location.href = `https://${window.location.host}?roomid=${roomid}`;
    };

</script>

<!-- header -->
<Header style="font-size: x-large;" company="Monte" platformName="Carlo"/>

<!-- main content -->
<Content style="padding-top: 100px;">
    <Grid>
    <Row>
        <Column>
            <Row>
                <Column>
                    <h1>Premium code editor.</h1>
                </Column>
            </Row>
            <Row>
                <Column>
                    <h1>Now free for everyone.</h1>
                </Column>
            </Row>
            <Row style="padding-top: 30px;">
                <Column>
                    <p>We re-engineered the service that we didn't build, Monaco, <br/>and made it easy to share and colaborate with.</p>
                </Column>
            </Row>
            <Row style="padding-top: 50px;">
                <Column>
                    <Button on:click={createNewRoom}>Create Room</Button>
                </Column>
            </Row>
        </Column>
        <Column style="padding-top: 50px;">
            <Row>
                <Column>
                    <p>To join a room, use the Room ID as the URL parameter (as shown below).</p>
                </Column>
            </Row>
            <Row style="padding-top: 30px;">
                <Column>
                    <CodeSnippet code="https://monte-carlo-editor.netlify.com?roomid=<CODE-HERE>" />
                </Column>
            </Row>
        </Column>
    </Row>
    </Grid>
</Content>
