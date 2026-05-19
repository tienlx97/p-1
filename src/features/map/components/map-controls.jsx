"use client";

import { useState } from "react";
import { Button } from "react-aria-components";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/features/map/constants/map.constants";
import { fitMapToCheckins, latLngToLngLat } from "@/features/map/utils/map.utils";
import styles from "./map-controls.module.css";

function stopMapInteraction(event) {
  event.stopPropagation();
}

/**
 * @typedef {object} MapControlsProps
 * @property {import("maplibre-gl").Map | null} map
 * @property {import("@/entities/memory/mock-data").MemoryCheckin | null} activeCheckin
 * @property {import("@/entities/memory/mock-data").MemoryCheckin[]} visibleCheckins
 */

/**
 * @param {MapControlsProps} props
 */
export function MapControls({ map, activeCheckin, visibleCheckins }) {
  const [locationStatus, setLocationStatus] = useState("");

  function resetView() {
    if (!map) {
      return;
    }

    if (activeCheckin) {
      map.flyTo({
        center: [activeCheckin.longitude, activeCheckin.latitude],
        duration: 550,
        zoom: 13
      });
      return;
    }

    if (visibleCheckins.length === 1) {
      fitMapToCheckins(map, visibleCheckins);
      return;
    }

    map.flyTo({
      center: latLngToLngLat(DEFAULT_CENTER),
      duration: 550,
      zoom: DEFAULT_ZOOM
    });
  }

  function locateUser() {
    if (!map) {
      return;
    }

    if (!navigator.geolocation) {
      setLocationStatus("Trình duyệt không hỗ trợ vị trí");
      return;
    }

    setLocationStatus("Đang lấy vị trí...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.flyTo({
          center: [longitude, latitude],
          duration: 550,
          zoom: 14
        });
        setLocationStatus("Đã đến vị trí hiện tại");
      },
      () => {
        setLocationStatus("Chưa cấp quyền vị trí");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60_000,
        timeout: 10_000
      }
    );
  }

  return (
    <div
      className={styles.root}
      aria-label="Điều khiển bản đồ"
      onClick={stopMapInteraction}
      onDoubleClick={stopMapInteraction}
      onPointerDown={stopMapInteraction}
      onWheel={stopMapInteraction}
    >
      <div className={styles.group}>
        <Button
          type="button"
          title="Phóng to"
          aria-label="Phóng to"
          isDisabled={!map}
          onPress={() => map?.zoomIn({ duration: 250 })}
        >
          +
        </Button>
        <span aria-hidden="true" />
        <Button
          type="button"
          title="Thu nhỏ"
          aria-label="Thu nhỏ"
          isDisabled={!map}
          onPress={() => map?.zoomOut({ duration: 250 })}
        >
          -
        </Button>
      </div>

      <div className={styles.controlButton}>
        <Button
          type="button"
          title="Đưa về hành trình"
          aria-label="Đưa về hành trình"
          isDisabled={!map}
          onPress={resetView}
        >
          <span className={styles.compassIcon} aria-hidden="true" />
        </Button>
      </div>

      <div className={styles.controlButton}>
        <Button
          type="button"
          title="Vị trí hiện tại"
          aria-label="Vị trí hiện tại"
          isDisabled={!map}
          onPress={locateUser}
        >
          <span className={styles.locationIcon} aria-hidden="true" />
        </Button>
      </div>

      {locationStatus ? <p className={styles.locationStatus}>{locationStatus}</p> : null}
    </div>
  );
}
