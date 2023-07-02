import React from "react";
import {useEffect} from "react";
import {Loading} from "../image-browser/App.jsx";
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import './CozyExtraNetworks.css'
import {ExtraNetworksCard} from "./ExtraNetworksCard.jsx";
import {Column} from "../main/Utils.jsx";

const nevyshaScrollbar = {
  '&::-webkit-scrollbar': {
    width: '5px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'var(--ae-primary-color)',
    borderRadius: '20px',
  },
}



export function CozyExtraNetworks() {

  const [extraNetworks, setExtraNetworks] = React.useState([])
  const [ready, setReady] = React.useState(false)

  const [searchString, setSearchString] = React.useState('')

  useEffect(() => {
    (async () => {
      const response = await fetch('/cozy-nest/extra_networks')
      if (response.status === 200) {
        const json = await response.json()
        setExtraNetworks(json)
        setReady(true)
      }
      else {
        CozyLogger.error('failed to fetch extra networks', response)
      }
    })()
  }, [])

  function buildExtraNetworks() {

    const EnTabs = [];
    const EnTabPanels = [];

    Object.keys(extraNetworks).forEach((network, index) => {
      let tabName = String(network);
      if (network === 'embeddings') {
        tabName = 'Textual Inversion'
      }
      EnTabs.push(
        <Tab key={index}>{tabName}</Tab>
      )
      EnTabPanels.push(
        <TabPanel css={nevyshaScrollbar} key={index}>
          <div className="CozyExtraNetworksPanels">
            {extraNetworks[network].map((item, index) => {
              return <ExtraNetworksCard key={index} item={item} searchString={searchString}/>
            })}
          </div>
        </TabPanel>
      )
    })

    return {EnTabs, EnTabPanels}
  }

  const Ui = buildExtraNetworks()

  return (
    <div className="CozyExtraNetworks">
      {!ready && <Loading label="Loading Extra Networks..."/>}
      {ready &&
        <Column>
          <textarea data-testid="textbox"
                    placeholder="Search..."
                    rows="1"
                    spellCheck="false"
                    data-gramm="false"
                    style={{resize: 'none'}}
                    onChange={(e) => setSearchString(e.target.value)}/>
          <Tabs variant='nevysha'>
            <TabList style={{backgroundColor: 'var(--tab-nav-background-color)'}}>
              {Ui.EnTabs}
            </TabList>
            <TabPanels>
              {Ui.EnTabPanels}
            </TabPanels>
          </Tabs>
        </Column>
      }
    </div>
  )
}