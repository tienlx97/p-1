"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Input } from "react-aria-components";
import { moods } from "@/entities/memory";
import { Field, SelectField, SelectItem, TextAreaField } from "@/shared/components/ui";

import { cx } from "@/shared/lib/cx";
import styles from "./quick-memory-panel.module.css";

/**
 * @param {{ embedded?: boolean }} props
 */
export function QuickMemoryPanel({ embedded = false }) {
  const [saved, setSaved] = useState(false);
  const [title, setTitle] = useState("");
  const [memoryDate, setMemoryDate] = useState("");
  const [locationName, setLocationName] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [mediaItems, setMediaItems] = useState([]);
  const mediaItemsRef = useRef([]);
  const canSave = title.trim().length > 0 && memoryDate.length > 0 && locationName.trim().length > 0 && mediaItems.length > 0;

  useEffect(() => {
    mediaItemsRef.current = mediaItems;
  }, [mediaItems]);

  useEffect(() => {
    return () => {
      for (const item of mediaItemsRef.current) {
        URL.revokeObjectURL(item.url);
      }
    };
  }, []);

  function addMediaItems(event) {
    const files = [...(event.currentTarget.files ?? [])];

    if (files.length === 0) {
      return;
    }

    const nextItems = files.map((file) => ({
      id: createMediaId(),
      name: file.name,
      size: file.size,
      type: file.type.startsWith("video/") ? "video" : "image",
      url: URL.createObjectURL(file)
    }));

    setMediaItems((currentItems) => [...currentItems, ...nextItems]);
    event.currentTarget.value = "";
  }

  function removeMediaItem(id) {
    setMediaItems((currentItems) => {
      const itemToRemove = currentItems.find((item) => item.id === id);

      if (itemToRemove) {
        URL.revokeObjectURL(itemToRemove.url);
      }

      return currentItems.filter((item) => item.id !== id);
    });
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setCoordinates("Trình duyệt không hỗ trợ vị trí");
      return;
    }

    setCoordinates("Đang lấy vị trí hiện tại...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nextCoordinates = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        setCoordinates(nextCoordinates);
        setGoogleMapsUrl(`https://maps.google.com/?q=${nextCoordinates}`);
      },
      () => {
        setCoordinates("Chưa cấp quyền vị trí");
      }
    );
  }

  return (
    <form
      className={styles.root}
      onSubmit={(event) => {
        event.preventDefault();
        if (!canSave) {
          return;
        }
        setSaved(true);
      }}
    >
      {embedded ? null : (
        <div className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>Thêm nhanh</p>
            <h2>Kỷ niệm mới</h2>
          </div>
        </div>
      )}

      <Field
        isRequired
        className={styles.field}
        label="Tiêu đề *"
        value={title}
        onChange={setTitle}
        placeholder="Ví dụ: Xem hoàng hôn ở cầu Mống"
      />

      <div className={cx(styles.fieldGrid, "gap-2")}>
        <Field
          isRequired
          className={styles.field}
          label="Ngày *"
          type="date"
          value={memoryDate}
          onChange={setMemoryDate}
        />

        <SelectField className={cx(styles.field, styles.selectField)} label="Cảm xúc" defaultSelectedKey="memorable">
          {moods.map((mood) => (
            <SelectItem id={mood.id} key={mood.id}>
              {mood.name}
            </SelectItem>
          ))}
        </SelectField>
      </div>

      <Field
        className={styles.field}
        label="Địa điểm"
        value={locationName}
        onChange={setLocationName}
        placeholder="Tên quán, cây cầu, công viên..."
      />

      <div className={cx(styles.fieldGrid, styles.locationDetailGrid, "gap-2")}>
        <Field
          className={styles.field}
          label="Tọa độ"
          value={coordinates}
          onChange={setCoordinates}
          placeholder="10.77689, 106.70090"
          description="Nhập theo dạng vĩ độ, kinh độ hoặc bấm Vị trí hiện tại."
        />
        <Field
          className={styles.field}
          label="URL Google Maps"
          type="url"
          value={googleMapsUrl}
          onChange={setGoogleMapsUrl}
          placeholder="https://maps.google.com/?q=10.77689,106.70090"
          description="Dán link chia sẻ từ Google Maps nếu bạn đã có sẵn địa điểm."
        />
      </div>

      <TextAreaField
        className={styles.field}
        label="Ghi chú"
        rows={4}
        placeholder="Viết vài dòng để sau này đọc lại vẫn nhớ cảm giác hôm đó."
      />

      <section className={styles.mediaSection} aria-label="Thêm ảnh hoặc video">
        <div className={styles.mediaSectionHead}>
          <div>
            <strong>Ảnh và video</strong>
            <small>Thêm media sau khi đã nhập thông tin chính.</small>
          </div>
          {mediaItems.length > 0 ? <span>{mediaItems.length} file</span> : null}
        </div>

        <label className={styles.upload} htmlFor="quick-photos">
          <Input id="quick-photos" type="file" accept="image/*,video/*" multiple onChange={addMediaItems} />
          <span aria-hidden="true">+</span>
          <strong>Thêm ảnh hoặc video</strong>
          <small>Chọn một hoặc nhiều ảnh/video từ máy của bạn.</small>
        </label>

        {mediaItems.length > 0 ? (
          <div className={styles.mediaPreview} aria-label="Ảnh và video đã chọn">
            {mediaItems.map((item) => (
              <figure className={styles.mediaItem} key={item.id}>
                {item.type === "video" ? (
                  <video src={item.url} muted playsInline preload="metadata" />
                ) : (
                  <img alt="" src={item.url} />
                )}
                <figcaption>
                  <strong>{item.name}</strong>
                  <small>{item.type === "video" ? "Video" : "Ảnh"} · {formatFileSize(item.size)}</small>
                </figcaption>
                <Button
                  aria-label={`Xóa ${item.name}`}
                  className={styles.mediaRemove}
                  type="button"
                  onPress={() => removeMediaItem(item.id)}
                >
                  ×
                </Button>
              </figure>
            ))}
          </div>
        ) : null}
      </section>

      <div className={cx(styles.actions, "gap-2")}>
        <Button className={cx(styles.button, styles.primaryButton)} type="submit" isDisabled={!canSave}>
          <span aria-hidden="true">+</span>
          Lưu kỷ niệm
        </Button>
        <Button className={cx(styles.button, styles.secondaryButton)} type="button" onPress={useCurrentLocation}>
          <span aria-hidden="true">⌖</span>
          Vị trí hiện tại
        </Button>
      </div>

      {saved ? <p className={styles.saveState}>Đã lưu bản nháp trên màn hình.</p> : null}
    </form>
  );
}

/**
 * @returns {string}
 */
function createMediaId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * @param {number} size
 * @returns {string}
 */
function formatFileSize(size) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}
