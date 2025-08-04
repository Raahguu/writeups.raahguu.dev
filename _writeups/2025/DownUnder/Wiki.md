---
layout: writeup
title: Wiki
tags: Misc
excerpt: "Use the Wiki to find the flag..."
---

## Warning

This is a part 2 to the Down Under CTF 2025 challenge `Horoscopes` I didn't solve that one my teammate did so I don't have a writeup for it.

<details><summary>Quick recap of the `Horoscopes` challenge</summary>

Recap: the Horoscopes challenge needed you to connect using the gemeni protocol to the given link, and then that gave you the flag

{% highlight text %}
$ echo -en "gemini://chal.2025.ductf.net:30015/\r\n" | ncat --ssl chal.2025.ductf.net 30015
20 text/gemini;lang=en-US
# Welcome to the Wasteland Network

The year is 2831. It's been XXXX years since The Collapse. The old web is dead - corrupted by the HTTPS viral cascade that turned our connected world into a weapon against us.

But we survive. We adapt. We rebuild.

This simple Gemini capsule is one node in the new network we're building - free from the complexity that doomed the old internet. No JavaScript. No cookies. No tracking. Just pure, clean information exchange.

Some pages are struggling with corruption as we take further attacks.

## Navigation

=> /survival.gmi Survival Basics: First Steps in the New World
=> /salvaging.gmi Tech Salvaging: Safe Computing After the Fall
=> /community-hub.gmi Community Hub: Finding Other Survivors
=> /about-us.gmi About the Wasteland Network

## Daily Advisory

⚠ ALERT: Increased bot activity reported in old HTTP sectors 44-48. Avoid all mainstream browser use in these digital quadrants.

⚠ REMINDER: Always verify capsule certificates before sharing sensitive information. Trust no one who won't use Gemini protocol.

⚠ WARNING: Protocol has sustainnnnnned damages. Corruption detected within [------]. ProceeX with cauXXXn

## Message of the Day

DUCTF{g3mini_pr0t0col_s4ved_us}

"The old web was a mansion with a thousand unlocked doors. The new web is a bunker with one good lock."
- Ada, Network Founder

Remember: Simple is safe. Complex is compromise.

## Update Log

* 2831-04-04: Added new communications relay points in sectors 7 and 9
* 2831-04-03: Updated survival maps for Western salvage zones
* 2831-04-01: Repaired node connection to Australian wasteland network
{% endhighlight %}

That reveals the flag there: `DUCTF{g3mini_pr0t0col_s4ved_us}`

</details>


## Description

Dear Raahguu,

Use the Wiki to find the flag...

NOTE: This challenge is a continuation of "Horoscopes", we recommend you complete that challenge first!

Regards,
pix


## Solution

The index page that we saw in `Horoscopes` (You can view this page in the recap) contained links to further pages to look at. The most promosing to me is the `commmunity-hub.gmi`

So I `ncat` 'd the page:

```text
$ echo -en "gemini://chal.2025.ductf.net:30015/community-hub.gmi\r\n" | ncat --ssl chal.2025.ductf.net 30015
20 text/gemini;lang=en-US
# Community Hub: Finding Other Survivors

In both the physical and digital wasteland, isolation means death. Connection is survival.

## Active Network Nodes

The following community nodes have maintained consistent communication in the last lunar cycle:

* Northen Territory Wastelanders
* Western Salvage Operations
* Rocky Mountain Sanctuary
* Pacific Coast Naval Station
* Tasman Offshore Survivors
* Great Lakes Trading Alliance

Each maintains their own Gemini capsule. Connection instructions vary by region.

## Communication Protocols

Direct connections remain dangerous. Follow approved methods:

1. Initial broadcast using short-burst radio (frequencies change daily)
2. Response verification through dead-drop data exchange
3. Certificate exchange through in-person meetup
4. Gemini capsule link sharing only after steps 1-3 complete

Remember: Digital trust follows physical trust. Meet in person whenever possible.

## Warning Signs of Compromised Communities

Be cautious of groups that:

* Use traditional web browsers or request "modern" interfaces
* Share executable files or "helper applications"
* Request personal identification beyond current location
* Offer technological solutions that seem too advanced
* Have inconsistent communicaYYYY patterns

## Admin Panel

To access the community admin panel connect to port: 756f

Use the daily code phrase to prove you're not a bot.

## Upcoming Gatherings

* Solar Day Festival (Summer Solstice): All verified communities
* Resource Exchange (First Quarter Moon): Regional nodes only
* Knowledge Transfer (New Moon): XXXXnical specialists

=> /verification-codes.gmi Temporary Access Codes for Known Communities
=> /emergency-protocol.gmi Emergency Contact Protocol
=> /linker.gmi The Community Wiki!
=> /index.gmi Return to Wasteland Network Home

## Super Special Thanks!

Thanks to the following communities for their contributions to the community:

XXXXX XXXXXXXXX XXXXX XXXXX XX XXXXXXXX XXXXXXXXXXX XXXXXXXXXX XXXXXX!
XXXXXXXXXXX XXXXXXXXXXXXXXXXXXXXXXXX XXXXXXXXXXXXXXXXXXXXX XXXXXXXXX  XXX XXXXXXXXXXXXXXXX XXXXX
XXXXXXXXXXXXXXXXXXXXXXX

XXXXX XXXXX XXXXX XXXXX XXXXXX
XXXXX
XXXX
```


This page showed the `/index.gmi` page and called it `The Community Wiki!`

The description said to use the Wiki to find the flag, so I immediatly went to the wiki:

```text
$ echo -en "gemini://chal.2025.ductf.net:30015/linker.gmi\r\n" | ncat --ssl chal.2025.ductf.net 30015
20 text/gemini;lang=en-US
# Our global links

This should help you navigate to all possible pages!

The wealth of knowledge you can find here is a result of the work of many people, we must continue to keep it free from the bots!


=> about-us.gmi about-us
=> community-hub.gmi community-hub
=> verification-codes.gmi verification-codes
=> pages/2001_a_space_odyssey.gmi 2001_a_space_odyssey
=> pages/2010_odyssey_two.gmi 2010_odyssey_two
=> pages/2061_odyssey_three.gmi 2061_odyssey_three
=> pages/3001_the_final_odyssey.gmi 3001_the_final_odyssey
=> pages/abandoned_signal_glitch.gmi abandoned_signal_glitch
=> pages/a_fall_of_moondust.gmi a_fall_of_moondust
=> pages/afforest_aftermath_blithesome.gmi afforest_aftermath_blithesome
=> pages/against_the_fall_of_night.gmi against_the_fall_of_night
=> pages/alpha_legion_strike.gmi alpha_legion_strike
=> index.gmi index
=> pages/beta_test_failure.gmi beta_test_failure
=> pages/bunker_whispers_static.gmi bunker_whispers_static
=> pages/caravan_route_echo.gmi caravan_route_echo
=> pages/chi_herculis_dyson_sphere.gmi chi_herculis_dyson_sphere
=> survival.gmi survival
=> pages/childhoods_end.gmi childhoods_end
=> pages/delta_wave_anomaly.gmi delta_wave_anomaly
=> pages/desolate_market_rumor.gmi desolate_market_rumor
=> pages/dyson_swarm.gmi dyson_swarm
=> pages/echo_chamber_flicker.gmi echo_chamber_flicker
=> pages/epsilon_echelon_command.gmi epsilon_echelon_command
=> pages/fallout_shelter_broadcast.gmi fallout_shelter_broadcast
=> pages/firstborn.gmi firstborn
=> pages/gamma_ray_burst.gmi gamma_ray_burst
=> pages/generation_ship_adrift.gmi generation_ship_adrift
=> pages/ghost_town_transmission.gmi ghost_town_transmission
=> pages/horizon_anomaly_data.gmi horizon_anomaly_data
=> pages/imperial_earth.gmi imperial_earth
=> pages/iota_draconis_system.gmi iota_draconis_system
=> pages/islands_in_the_sky.gmi islands_in_the_sky
=> pages/isotope_mine_warning.gmi isotope_mine_warning
=> pages/junk_heap_scavenger.gmi junk_heap_scavenger
=> salvaging.gmi salvaging
=> pages/kappa_fornacis_remnant.gmi kappa_fornacis_remnant
=> pages/kic_8462852.gmi kic_8462852
=> pages/kill_switch_override.gmi kill_switch_override
=> pages/lambda_centauri_nebula.gmi lambda_centauri_nebula
=> pages/lost_highway_signal.gmi lost_highway_signal
=> pages/matrioshka_brain.gmi matrioshka_brain
=> pages/mu_herculis_anomaly.gmi mu_herculis_anomaly
=> pages/mutant_outpost_chatter.gmi mutant_outpost_chatter
=> pages/nomad_camp_frequency.gmi nomad_camp_frequency
=> pages/nu_scorpii_black_hole.gmi nu_scorpii_black_hole
=> pages/oasis_mirage_illusion.gmi oasis_mirage_illusion
=> pages/omega_centauri_cluster.gmi omega_centauri_cluster
=> pages/rabid_bean_potato.gmi rabid-bean-potato
=> pages/omega_protocol_active.gmi omega_protocol_active
=> pages/omicron_persei_cloud.gmi omicron_persei_cloud
=> pages/phi_draconis_swarm.gmi phi_draconis_swarm
=> pages/pi_mensae_exoplanet.gmi pi_mensae_exoplanet
=> pages/protocol_override_failed.gmi protocol_override_failed
=> pages/psi_serpentis_anomaly.gmi psi_serpentis_anomaly
=> pages/quarantine_zone_breach.gmi quarantine_zone_breach
=> pages/reactor_core_meltdown.gmi reactor_core_meltdown
=> pages/rendezvous_with_rama.gmi rendezvous_with_rama
=> pages/rho_puppis_cluster.gmi rho_puppis_cluster
=> pages/rogue_planet_encounter.gmi rogue_planet_encounter
=> pages/scavenger_den_loot.gmi scavenger_den_loot
=> pages/sigma_draconis_signal.gmi sigma_draconis_signal
=> pages/sunstorm.gmi sunstorm
=> pages/tau_ceti_wreckage.gmi tau_ceti_wreckage
=> pages/terraforming_failure.gmi terraforming_failure
=> pages/the_boltzmann_brain.gmi the_boltzmann_brain
=> pages/the_brain_in_a_vat.gmi the_brain_in_a_vat
=> pages/the_city_and_the_sea.gmi the_city_and_the_sea
=> pages/the_city_and_the_stars.gmi the_city_and_the_stars
=> pages/the_city_of_the_sun.gmi the_city_of_the_sun
=> pages/the_deep_range.gmi the_deep_range
=> pages/the_fermi_paradox.gmi the_fermi_paradox
=> pages/the_fountains_of_paradise.gmi the_fountains_of_paradise
=> pages/the_ghost_from_the_grand_banks.gmi the_ghost_from_the_grand_banks
=> pages/the_great_filter.gmi the_great_filter
=> pages/the_hammer_of_god.gmi the_hammer_of_god
=> pages/the_last_question.gmi the_last_question
=> pages/the_last_theorem.gmi the_last_theorem
=> pages/the_library_of_babel.gmi the_library_of_babel
=> pages/the_light_of_other_days.gmi the_light_of_other_days
=> pages/the_lion_of_comarre.gmi the_lion_of_comarre
=> pages/the_nine_billion_names_of_god.gmi the_nine_billion_names_of_god
=> pages/the_planetarium_hypothesis.gmi the_planetarium_hypothesis
=> pages/the_quantum_suicide.gmi the_quantum_suicide
=> pages/the_sands_of_mars.gmi the_sands_of_mars
=> pages/the_sentinel.gmi the_sentinel
=> pages/the_simulation_hypothesis.gmi the_simulation_hypothesis
=> pages/the_songs_of_distant_earth.gmi the_songs_of_distant_earth
=> pages/the_star-child.gmi the_star-child
=> pages/the_star.gmi the_star
=> pages/theta_cygnus_cluster.gmi theta_cygnus_cluster
=> pages/the_wall_of_serpents.gmi the_wall_of_serpents
=> pages/the_wind_from_the_sun.gmi the_wind_from_the_sun
=> pages/the_zoo_hypothesis.gmi the_zoo_hypothesis
=> pages/times_eye.gmi times_eye
=> pages/tunnels_collapse_imminent.gmi tunnels_collapse_imminent
=> pages/underground_network_access.gmi underground_network_access
=> pages/upsilon_andromedae_anomaly.gmi upsilon_andromedae_anomaly
=> pages/von_neumann_probe.gmi von_neumann_probe
=> pages/vulture_swoop_omen.gmi vulture_swoop_omen
=> pages/wasteland_wanderer_tales.gmi wasteland_wanderer_tales
=> pages/xenoform_sighting_unverified.gmi xenoform_sighting_unverified
=> pages/xi_ophiuchi_variable.gmi xi_ophiuchi_variable
=> pages/zeta_grid_lockdown.gmi zeta_grid_lockdown
```

It is a list of every single page on the server. Now I realised that we were likely to use the wiki becuase the flag was on one of these pages.

I though it would be extremelly tedious to go through these pages one by one, so I wrote a bot to scrap the content of all these pages into a text file.

```python
import subprocess

# links to scrape
links = """=> about-us.gmi about-us
=> community-hub.gmi community-hub
=> verification-codes.gmi verification-codes
=> pages/2001_a_space_odyssey.gmi 2001_a_space_odyssey
=> pages/2010_odyssey_two.gmi 2010_odyssey_two
=> pages/2061_odyssey_three.gmi 2061_odyssey_three
=> pages/3001_the_final_odyssey.gmi 3001_the_final_odyssey
=> pages/abandoned_signal_glitch.gmi abandoned_signal_glitch
=> pages/a_fall_of_moondust.gmi a_fall_of_moondust
=> pages/afforest_aftermath_blithesome.gmi afforest_aftermath_blithesome
=> pages/against_the_fall_of_night.gmi against_the_fall_of_night
=> pages/alpha_legion_strike.gmi alpha_legion_strike
=> index.gmi index
=> pages/beta_test_failure.gmi beta_test_failure
=> pages/bunker_whispers_static.gmi bunker_whispers_static
=> pages/caravan_route_echo.gmi caravan_route_echo
=> pages/chi_herculis_dyson_sphere.gmi chi_herculis_dyson_sphere
=> survival.gmi survival
=> pages/childhoods_end.gmi childhoods_end
=> pages/delta_wave_anomaly.gmi delta_wave_anomaly
=> pages/desolate_market_rumor.gmi desolate_market_rumor
=> pages/dyson_swarm.gmi dyson_swarm
=> pages/echo_chamber_flicker.gmi echo_chamber_flicker
=> pages/epsilon_echelon_command.gmi epsilon_echelon_command
=> pages/fallout_shelter_broadcast.gmi fallout_shelter_broadcast
=> pages/firstborn.gmi firstborn
=> pages/gamma_ray_burst.gmi gamma_ray_burst
=> pages/generation_ship_adrift.gmi generation_ship_adrift
=> pages/ghost_town_transmission.gmi ghost_town_transmission
=> pages/horizon_anomaly_data.gmi horizon_anomaly_data
=> pages/imperial_earth.gmi imperial_earth
=> pages/iota_draconis_system.gmi iota_draconis_system
=> pages/islands_in_the_sky.gmi islands_in_the_sky
=> pages/isotope_mine_warning.gmi isotope_mine_warning
=> pages/junk_heap_scavenger.gmi junk_heap_scavenger
=> salvaging.gmi salvaging
=> pages/kappa_fornacis_remnant.gmi kappa_fornacis_remnant
=> pages/kic_8462852.gmi kic_8462852
=> pages/kill_switch_override.gmi kill_switch_override
=> pages/lambda_centauri_nebula.gmi lambda_centauri_nebula
=> pages/lost_highway_signal.gmi lost_highway_signal
=> pages/matrioshka_brain.gmi matrioshka_brain
=> pages/mu_herculis_anomaly.gmi mu_herculis_anomaly
=> pages/mutant_outpost_chatter.gmi mutant_outpost_chatter
=> pages/nomad_camp_frequency.gmi nomad_camp_frequency
=> pages/nu_scorpii_black_hole.gmi nu_scorpii_black_hole
=> pages/oasis_mirage_illusion.gmi oasis_mirage_illusion
=> pages/omega_centauri_cluster.gmi omega_centauri_cluster
=> pages/rabid_bean_potato.gmi rabid-bean-potato
=> pages/omega_protocol_active.gmi omega_protocol_active
=> pages/omicron_persei_cloud.gmi omicron_persei_cloud
=> pages/phi_draconis_swarm.gmi phi_draconis_swarm
=> pages/pi_mensae_exoplanet.gmi pi_mensae_exoplanet
=> pages/protocol_override_failed.gmi protocol_override_failed
=> pages/psi_serpentis_anomaly.gmi psi_serpentis_anomaly
=> pages/quarantine_zone_breach.gmi quarantine_zone_breach
=> pages/reactor_core_meltdown.gmi reactor_core_meltdown
=> pages/rendezvous_with_rama.gmi rendezvous_with_rama
=> pages/rho_puppis_cluster.gmi rho_puppis_cluster
=> pages/rogue_planet_encounter.gmi rogue_planet_encounter
=> pages/scavenger_den_loot.gmi scavenger_den_loot
=> pages/sigma_draconis_signal.gmi sigma_draconis_signal
=> pages/sunstorm.gmi sunstorm
=> pages/tau_ceti_wreckage.gmi tau_ceti_wreckage
=> pages/terraforming_failure.gmi terraforming_failure
=> pages/the_boltzmann_brain.gmi the_boltzmann_brain
=> pages/the_brain_in_a_vat.gmi the_brain_in_a_vat
=> pages/the_city_and_the_sea.gmi the_city_and_the_sea
=> pages/the_city_and_the_stars.gmi the_city_and_the_stars
=> pages/the_city_of_the_sun.gmi the_city_of_the_sun
=> pages/the_deep_range.gmi the_deep_range
=> pages/the_fermi_paradox.gmi the_fermi_paradox
=> pages/the_fountains_of_paradise.gmi the_fountains_of_paradise
=> pages/the_ghost_from_the_grand_banks.gmi the_ghost_from_the_grand_banks
=> pages/the_great_filter.gmi the_great_filter
=> pages/the_hammer_of_god.gmi the_hammer_of_god
=> pages/the_last_question.gmi the_last_question
=> pages/the_last_theorem.gmi the_last_theorem
=> pages/the_library_of_babel.gmi the_library_of_babel
=> pages/the_light_of_other_days.gmi the_light_of_other_days
=> pages/the_lion_of_comarre.gmi the_lion_of_comarre
=> pages/the_nine_billion_names_of_god.gmi the_nine_billion_names_of_god
=> pages/the_planetarium_hypothesis.gmi the_planetarium_hypothesis
=> pages/the_quantum_suicide.gmi the_quantum_suicide
=> pages/the_sands_of_mars.gmi the_sands_of_mars
=> pages/the_sentinel.gmi the_sentinel
=> pages/the_simulation_hypothesis.gmi the_simulation_hypothesis
=> pages/the_songs_of_distant_earth.gmi the_songs_of_distant_earth
=> pages/the_star-child.gmi the_star-child
=> pages/the_star.gmi the_star
=> pages/theta_cygnus_cluster.gmi theta_cygnus_cluster
=> pages/the_wall_of_serpents.gmi the_wall_of_serpents
=> pages/the_wind_from_the_sun.gmi the_wind_from_the_sun
=> pages/the_zoo_hypothesis.gmi the_zoo_hypothesis
=> pages/times_eye.gmi times_eye
=> pages/tunnels_collapse_imminent.gmi tunnels_collapse_imminent
=> pages/underground_network_access.gmi underground_network_access
=> pages/upsilon_andromedae_anomaly.gmi upsilon_andromedae_anomaly
=> pages/von_neumann_probe.gmi von_neumann_probe
=> pages/vulture_swoop_omen.gmi vulture_swoop_omen
=> pages/wasteland_wanderer_tales.gmi wasteland_wanderer_tales
=> pages/xenoform_sighting_unverified.gmi xenoform_sighting_unverified
=> pages/xi_ophiuchi_variable.gmi xi_ophiuchi_variable
=> pages/zeta_grid_lockdown.gmi zeta_grid_lockdown"""


def fetch_gemini_with_ncat(url):
    # Start ncat with ssl with a pipe for stdin and stdout
    proc = subprocess.Popen(
        "ncat --ssl chal.2025.ductf.net 30015",
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        shell=True
    )

    # Send the URL + CRLF to ncat stdin
    send_data = (f'gemini://chal.2025.ductf.net:30015/{url}\r\n').encode()
    stdout, stderr = proc.communicate(input=send_data)

	# If an error was thrown
    if proc.returncode != 0:
        return None, f"ncat exited with code {proc.returncode}. stderr: {stderr.decode()}"
	
	#If an error wasn't thrown
    return stdout.decode(errors='replace'), None


def main():
    output_file = "gemini_output.txt"

	# Pars the giant string for the actual urls
    sanatised_links = []
    l_links = links.splitlines()
    for link in l_links:
		# grab just the url part of each line
    	link = link.split(" ")[1]
    	sanatised_links.append(link)

	# Write the outputs of the ncats into the file
    with open(output_file, 'w') as f:
        for link in sanatised_links:
            print(f"Fetching {link}")
            body, err = fetch_gemini_with_ncat(link)
            f.write("----------\n")
            f.write(link + "\n")
            if err:
                f.write(f"Error: {err}\n\n")
            else:
                f.write(body + "\n\n")
            f.write("----------\n")

    print(f"Saved all outputs to {output_file}")

if __name__ == "__main__":
    main()
```


This then got me a giant file, which I then grepped for the flag

```text
$ grep "DUCTF" gemini_output.txt
DUCTF{g3mini_pr0t0col_s4ved_us}
DUCTF{rabbit_is_rabbit_bean_is_bean_potato_is_potato_banana_is_banana_carrot_is_carrot}
```

The flag `DUCTF{g3mini_pr0t0col_s4ved_us}` was for `Horoscopes` and was located in the `index.gmi` file.

The flag for this challenge was `DUCTF{rabbit_is_rabbit_bean_is_bean_potato_is_potato_banana_is_banana_carrot_is_carrot}`

Searching for the flag in vim revealed that it was within the `pages/rabid_bean_potato.gmi` page.

There was a third part to the challenge called `Trusted` I also didn't solve that one, but if you liked this I suggest reading someones writeup of that.
